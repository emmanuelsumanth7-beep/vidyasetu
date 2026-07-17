/**
 * theme.ts
 *
 * Client-side multi-tenant theme loader for the Vidya Setu Capacitor app.
 *
 * Public API
 * ──────────
 *   initTheme()           — call once on app launch (layout.tsx)
 *   fetchAndApplyTheme()  — fetch from API, apply to DOM, write cache
 *   applyTheme()          — apply a ThemeConfig to :root CSS variables
 *   loadCachedTheme()     — apply whatever is in localStorage (offline path)
 *   clearSchoolCode()     — sign out / switch school
 *   getSchoolCode()       — read stored code
 *   setSchoolCode()       — write code (first-launch setup screen)
 *
 * CSS custom properties written by applyTheme()
 * ─────────────────────────────────────────────
 *   --vs-primary          e.g. #007AFF
 *   --vs-secondary        e.g. #5856D6
 *   --vs-accent           e.g. #FF9500
 *   --vs-text-on-primary  e.g. #FFFFFF
 *   --vs-text-on-secondary
 *   --vs-text-on-accent
 *
 * The existing globals.css already uses static values for these concepts
 * (--color-blue, --color-indigo etc.).  The VS variables are additive —
 * they do not replace the existing design tokens; components that want
 * school-specific branding opt-in by referencing --vs-* instead.
 */

'use client';

// ── Constants ────────────────────────────────────────────────────────────────

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'https://bot-api.smha.co.in/api';

const STORAGE_KEY_CODE  = 'vidya_school_code';
const STORAGE_KEY_THEME = 'vidya_school_theme';
const STORAGE_KEY_TS    = 'vidya_school_theme_ts';

/** Re-fetch from network after 5 minutes; serve cache beyond that. */
const CACHE_TTL_MS = 5 * 60 * 1000;

// ── Types ────────────────────────────────────────────────────────────────────

export interface ThemeConfig {
  primary:         string;
  secondary:       string;
  accent:          string;
  textOnPrimary:   string;
  textOnSecondary: string;
  textOnAccent:    string;
  logoUrl:         string | null;
  appName:         string;
}

export const DEFAULT_THEME: ThemeConfig = {
  primary:         '#007AFF',
  secondary:       '#5856D6',
  accent:          '#FF9500',
  textOnPrimary:   '#FFFFFF',
  textOnSecondary: '#FFFFFF',
  textOnAccent:    '#000000',
  logoUrl:         null,
  appName:         'Vidya Setu',
};

// ── School code helpers ──────────────────────────────────────────────────────

export function getSchoolCode(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY_CODE);
}

export function setSchoolCode(code: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_CODE, code.trim().toLowerCase());
}

export function clearSchoolCode(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_CODE);
  localStorage.removeItem(STORAGE_KEY_THEME);
  localStorage.removeItem(STORAGE_KEY_TS);
}

// ── Cache helpers ────────────────────────────────────────────────────────────

function writeThemeCache(theme: ThemeConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_THEME, JSON.stringify(theme));
    localStorage.setItem(STORAGE_KEY_TS, String(Date.now()));
  } catch {
    // localStorage quota exceeded — silent; the fetch path will retry next launch
  }
}

function readThemeCache(): ThemeConfig | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_THEME);
    if (!raw) return null;
    return JSON.parse(raw) as ThemeConfig;
  } catch {
    return null;
  }
}

function isCacheStale(): boolean {
  if (typeof window === 'undefined') return true;
  const ts = localStorage.getItem(STORAGE_KEY_TS);
  if (!ts) return true;
  return Date.now() - Number(ts) > CACHE_TTL_MS;
}

// ── DOM application ──────────────────────────────────────────────────────────

/**
 * Writes the theme's colours as CSS custom properties on :root.
 * Also swaps any <img data-school-logo> elements' src attribute.
 */
export function applyTheme(theme: ThemeConfig): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.style.setProperty('--vs-primary',           theme.primary);
  root.style.setProperty('--vs-secondary',          theme.secondary);
  root.style.setProperty('--vs-accent',             theme.accent);
  root.style.setProperty('--vs-text-on-primary',    theme.textOnPrimary);
  root.style.setProperty('--vs-text-on-secondary',  theme.textOnSecondary);
  root.style.setProperty('--vs-text-on-accent',     theme.textOnAccent);

  // Swap logo images — any <img> with data-school-logo attribute is updated.
  // This keeps component JSX declarative: <img data-school-logo alt="Logo" />
  if (theme.logoUrl) {
    document
      .querySelectorAll<HTMLImageElement>('img[data-school-logo]')
      .forEach((img) => {
        if (img.src !== theme.logoUrl) img.src = theme.logoUrl!;
      });
  }

  // Update document title with school name for browser tab / app switcher
  if (theme.appName) {
    document.title = `${theme.appName} — Workspace`;
  }
}

// ── Network fetch ────────────────────────────────────────────────────────────

/**
 * Fetches the theme for a given school code from the API.
 * Returns null (and logs a warning) on any network or parse error.
 */
async function fetchTheme(code: string): Promise<ThemeConfig | null> {
  try {
    const res = await fetch(`${API_BASE}/schools/${encodeURIComponent(code)}/theme`, {
      // 8-second timeout — enough for a slow 3G connection in India
      signal: AbortSignal.timeout(8000),
    });

    if (res.status === 404) {
      console.warn(`[theme] No school found for code "${code}"`);
      return null;
    }

    if (!res.ok) {
      console.warn(`[theme] API returned ${res.status} for code "${code}"`);
      return null;
    }

    const data = await res.json();

    // Minimal shape validation — guard against malformed API responses
    if (typeof data.primary !== 'string') {
      console.warn('[theme] API response missing required fields', data);
      return null;
    }

    return data as ThemeConfig;
  } catch (err: unknown) {
    // Network failure, timeout, or JSON parse error
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[theme] Fetch failed for code "${code}":`, msg);
    return null;
  }
}

// ── High-level entry points ──────────────────────────────────────────────────

/**
 * Applies the cached theme immediately (zero latency), then re-fetches in
 * the background if the cache is stale.  Safe to call on every page render —
 * idempotent when cache is fresh.
 *
 * @returns The theme that was applied synchronously (cached or default).
 */
export function loadCachedTheme(): ThemeConfig {
  const cached = readThemeCache() ?? DEFAULT_THEME;
  applyTheme(cached);
  return cached;
}

/**
 * Fetch a fresh theme for `code`, apply it, write the cache.
 * Returns the fetched theme on success or null on failure (caller can decide
 * whether to show an error or just keep the cached/default theme).
 */
export async function fetchAndApplyTheme(code: string): Promise<ThemeConfig | null> {
  const theme = await fetchTheme(code);
  if (theme) {
    applyTheme(theme);
    writeThemeCache(theme);
  }
  return theme;
}

/**
 * Full initialisation sequence — call this once on app launch.
 *
 * 1. Apply cached theme immediately (so the app doesn't flash unstyled).
 * 2. If no school code is set, return early — the setup screen will be shown.
 * 3. If cache is fresh, skip the network call.
 * 4. Otherwise fetch in the background (non-blocking) and update the UI when done.
 *
 * @returns `{ code, theme, needsSetup }`
 *   - `needsSetup` is true when no school code is stored — caller should
 *     redirect to the school-setup screen instead of the main dashboard.
 */
export async function initTheme(): Promise<{
  code:       string | null;
  theme:      ThemeConfig;
  needsSetup: boolean;
}> {
  // Step 1: apply cache immediately for zero-flash startup
  const initialTheme = loadCachedTheme();

  const code = getSchoolCode();

  if (!code) {
    return { code: null, theme: initialTheme, needsSetup: true };
  }

  if (!isCacheStale()) {
    // Cache is fresh — no network call needed
    return { code, theme: initialTheme, needsSetup: false };
  }

  // Step 4: background refresh — don't await, let the UI update once it lands
  fetchAndApplyTheme(code).catch(() => {
    // Already logged inside fetchAndApplyTheme; swallow here to avoid
    // unhandled promise rejections in the Capacitor WebView
  });

  return { code, theme: initialTheme, needsSetup: false };
}
