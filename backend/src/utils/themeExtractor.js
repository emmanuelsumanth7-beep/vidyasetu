/**
 * themeExtractor.js
 *
 * Extracts a school brand-theme from a logo image file.
 *
 * DESIGN CONTRACT — Lambda-swap guarantee
 * ────────────────────────────────────────
 * This module exports a single async function:
 *
 *   extractThemeFromBuffer(imageBuffer: Buffer, appName: string)
 *     → Promise<ThemeConfig>
 *
 * It has NO side-effects (no DB writes, no S3 calls, no Express req/res).
 * The caller (route handler today, Lambda handler tomorrow) is responsible
 * for reading the image and persisting the result.
 *
 * To move to Lambda:
 *   1. Create a Lambda triggered by s3:ObjectCreated on the logos/ prefix.
 *   2. In the Lambda handler: download the S3 object → Buffer, call this
 *      function, PATCH /internal/schools/:id/theme with the result.
 *   3. Remove the synchronous call from the Express route; the route
 *      can return 202 Accepted immediately and let the Lambda finish async.
 *
 * WCAG contrast
 * ─────────────
 * For each extracted swatch we compute the relative luminance of the swatch
 * colour and decide whether #FFFFFF or #000000 gives a higher contrast ratio
 * (WCAG 2.1 §1.4.3 requires ≥ 4.5:1 for normal text, ≥ 3:1 for large text).
 * We target 4.5:1 so every generated text colour is AA-compliant for body copy.
 */

'use strict';

const Vibrant = require('node-vibrant');

// ---------------------------------------------------------------------------
// WCAG relative luminance helpers
// ---------------------------------------------------------------------------

/**
 * Converts a single 8-bit sRGB channel value to its linearised component.
 * @param {number} c  integer 0–255
 * @returns {number}  linear light value 0–1
 */
function toLinear(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

/**
 * WCAG 2.1 relative luminance of an RGB triplet.
 * @param {number} r  0–255
 * @param {number} g  0–255
 * @param {number} b  0–255
 * @returns {number}  0–1
 */
function relativeLuminance(r, g, b) {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * WCAG 2.1 contrast ratio between two luminance values.
 * @param {number} l1  lighter luminance (or either order — function handles it)
 * @param {number} l2
 * @returns {number}  1–21
 */
function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker  = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Returns '#FFFFFF' or '#000000', whichever achieves the higher WCAG contrast
 * ratio against the supplied hex background colour.
 *
 * @param {string} hexBg  e.g. '#3B5998'
 * @returns {string}      '#FFFFFF' or '#000000'
 */
function readableTextColor(hexBg) {
  const hex = hexBg.replace('#', '');
  const r   = parseInt(hex.slice(0, 2), 16);
  const g   = parseInt(hex.slice(2, 4), 16);
  const b   = parseInt(hex.slice(4, 6), 16);

  const bgLum     = relativeLuminance(r, g, b);
  const whiteLum  = 1.0;   // luminance of #FFFFFF
  const blackLum  = 0.0;   // luminance of #000000

  const contrastWhite = contrastRatio(bgLum, whiteLum);
  const contrastBlack = contrastRatio(bgLum, blackLum);

  return contrastWhite >= contrastBlack ? '#FFFFFF' : '#000000';
}

/**
 * Converts a node-vibrant [r, g, b] array to a CSS hex string.
 * @param {number[]} rgb  e.g. [59, 89, 152]
 * @returns {string}      e.g. '#3B5998'
 */
function rgbToHex([r, g, b]) {
  return '#' + [r, g, b]
    .map(v => Math.round(v).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

// ---------------------------------------------------------------------------
// Default fallback theme (Vidya Setu brand palette)
// Used when extraction fails or a swatch is missing.
// ---------------------------------------------------------------------------
const DEFAULT_THEME = {
  primary:         '#007AFF',
  secondary:       '#5856D6',
  accent:          '#FF9500',
  textOnPrimary:   '#FFFFFF',
  textOnSecondary: '#FFFFFF',
  textOnAccent:    '#000000',
};

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Extracts a 3-swatch brand theme from a logo image buffer.
 *
 * @param {Buffer}  imageBuffer  Raw image bytes (PNG/JPEG/GIF/WebP)
 * @param {string}  appName      School name — stored in the returned config
 *                               so clients can render it without an extra fetch
 * @param {string}  logoUrl      Public URL of the already-uploaded logo
 * @returns {Promise<ThemeConfig>}
 *
 * @typedef {Object} ThemeConfig
 * @property {string} primary          — dominant brand colour hex
 * @property {string} secondary        — muted/dark-vibrant hex
 * @property {string} accent           — vibrant/light-vibrant hex
 * @property {string} textOnPrimary    — WCAG-AA readable text on primary bg
 * @property {string} textOnSecondary  — WCAG-AA readable text on secondary bg
 * @property {string} textOnAccent     — WCAG-AA readable text on accent bg
 * @property {string} logoUrl          — passed through from caller
 * @property {string} appName          — passed through from caller
 * @property {string} extractedAt      — ISO timestamp
 */
async function extractThemeFromBuffer(imageBuffer, appName, logoUrl) {
  let swatches;
  try {
    // node-vibrant can accept a Buffer directly.
    // colorCount=16 is the palette size; quality=1 samples every pixel for
    // school logos which are typically small (<200 KB) and icon-like.
    const palette = await Vibrant.from(imageBuffer)
      .quality(1)
      .maxColorCount(16)
      .getPalette();

    swatches = palette;
  } catch (err) {
    // Extraction failure must not break the upload flow; return the default
    // theme with a note so the caller can decide whether to surface a warning.
    console.warn('[themeExtractor] Vibrant failed, falling back to defaults:', err.message);
    return {
      ...DEFAULT_THEME,
      logoUrl:     logoUrl   || null,
      appName:     appName   || 'Vidya Setu',
      extractedAt: new Date().toISOString(),
      _fallback:   true,
    };
  }

  // ── Swatch priority mapping ───────────────────────────────────────────────
  // node-vibrant returns up to 6 named swatches.  We assign:
  //   primary   → DarkVibrant  (strong, readable on white/dark backgrounds)
  //   secondary → DarkMuted    (subdued complement)
  //   accent    → Vibrant      (highlight / CTA colour)
  //
  // Each falls back through the priority list if the preferred swatch is absent.
  const pickHex = (...preferenceOrder) => {
    for (const key of preferenceOrder) {
      if (swatches[key] && swatches[key].getRgb) {
        return rgbToHex(swatches[key].getRgb());
      }
    }
    return null; // caller handles null → default
  };

  const primary   = pickHex('DarkVibrant', 'Vibrant', 'DarkMuted', 'Muted')
                    || DEFAULT_THEME.primary;
  const secondary = pickHex('DarkMuted', 'Muted', 'LightMuted', 'DarkVibrant')
                    || DEFAULT_THEME.secondary;
  const accent    = pickHex('Vibrant', 'LightVibrant', 'LightMuted', 'Muted')
                    || DEFAULT_THEME.accent;

  return {
    primary,
    secondary,
    accent,
    textOnPrimary:   readableTextColor(primary),
    textOnSecondary: readableTextColor(secondary),
    textOnAccent:    readableTextColor(accent),
    logoUrl:         logoUrl   || null,
    appName:         appName   || 'Vidya Setu',
    extractedAt:     new Date().toISOString(),
  };
}

module.exports = {
  extractThemeFromBuffer,
  // Export helpers for unit testing
  readableTextColor,
  relativeLuminance,
  contrastRatio,
};
