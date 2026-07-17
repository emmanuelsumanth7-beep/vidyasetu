/**
 * routes/theme.js
 *
 * POST /api/admin/schools/:id/logo   (authenticated — PRINCIPAL or SUPER_ADMIN)
 * GET  /api/schools/:code/theme      (public)
 *
 * Security invariants this file enforces
 * ───────────────────────────────────────
 * 1. Tenant isolation: the ownership check runs BEFORE multer touches the
 *    request.  If a PRINCIPAL tries to upload to a school they don't own, the
 *    request is rejected with 403 before any bytes are written to S3 or disk.
 *
 * 2. File validation: only JPEG/PNG/GIF/WebP ≤ 5 MB are accepted.  The limits
 *    and fileFilter live in s3.js (logoUpload) so they apply consistently
 *    regardless of which route calls the middleware.
 *
 * 3. Reserved slug denylist: school codes that collide with application route
 *    segments or API prefixes are rejected at write time.
 *
 * Lambda-swap contract (still intact)
 * ─────────────────────────────────────
 * extractThemeFromBuffer() is called synchronously inside the route.  To move
 * to an async S3-event Lambda:
 *   - Delete the extractThemeFromBuffer() call block.
 *   - Return 202 Accepted with { logoUrl }.
 *   - The Lambda receives the S3 PutObject event, downloads the buffer,
 *     calls extractThemeFromBuffer(), then PATCHes /internal/schools/:id/theme.
 * No other file needs to change.
 */

'use strict';

const express = require('express');
const fs      = require('fs');
const router  = express.Router();

const { verifyFirebaseAuth }     = require('../middleware/firebaseAuth');
const { extractThemeFromBuffer } = require('../utils/themeExtractor');
const { logoUpload }             = require('../utils/s3');

// ── Reserved school codes ────────────────────────────────────────────────────
// These strings would collide with Express route segments, Next.js pages, or
// well-known path prefixes if used as school codes.  The list is intentionally
// conservative — it is cheaper to block a harmless slug than to debug a routing
// collision in production.
const RESERVED_CODES = new Set([
  'admin',
  'api',
  'schools',
  'school',
  'school-setup',
  'dashboard',
  'login',
  'logout',
  'auth',
  'mfa',
  'mfa-setup',
  'uploads',
  'static',
  'favicon',
  'robots',
  'sitemap',
  'health',
  'metrics',
  'internal',
  'vidya',          // platform brand name
  'vidyasetu',
  'setu',
]);

// ── Role guard ───────────────────────────────────────────────────────────────
const requireAdmin = (req, res, next) => {
  const role = req.user?.role;
  if (!role || !['PRINCIPAL', 'SUPER_ADMIN'].includes(role)) {
    return res.status(403).json({ error: 'Forbidden: Principal or Super Admin role required' });
  }
  next();
};

// ── Pre-upload ownership guard ───────────────────────────────────────────────
// CRITICAL: this runs BEFORE logoUpload so we never write bytes to storage
// for a request that will be rejected on auth grounds.
//
// We cannot do the full DB lookup here (we want to avoid two DB round-trips),
// so we do a lightweight check: if the caller is a PRINCIPAL, their
// req.user.schoolId must match the :id param.  SUPER_ADMIN bypasses this.
// The full record lookup (for school name, etc.) still happens inside the
// main handler after the upload — that is fine because at that point we
// already know the principal is authorised to write to this school.
const preUploadTenantGuard = (req, res, next) => {
  if (!req.user) {
    // Should never reach here (verifyFirebaseAuth runs first), but be explicit.
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  if (req.user.role === 'PRINCIPAL' && req.params.id !== req.user.schoolId) {
    return res.status(403).json({
      error: 'Forbidden: you can only upload a logo for your own school',
    });
  }

  next();
};

// ── Multer error handler ─────────────────────────────────────────────────────
// logoUpload calls next(err) with a .status property on validation failures.
// This middleware turns those into clean JSON responses.
// It must be placed AFTER logoUpload in the middleware chain.
const handleUploadError = (err, req, res, next) => {
  if (err && (err.status || err.code)) {
    return res.status(err.status || 400).json({ error: err.message });
  }
  next(err);
};

// ── Buffer reader ────────────────────────────────────────────────────────────
async function getUploadedBuffer(file) {
  if (file.buffer) return file.buffer;           // memoryStorage (future)

  if (file.location) {
    // multer-s3: file was streamed to S3; fetch it back for Vibrant extraction.
    // For the Lambda migration path, skip this entirely — the Lambda reads
    // directly from the S3 PutObject event payload.
    const client = file.location.startsWith('https') ? require('https') : require('http');
    return new Promise((resolve, reject) => {
      client.get(file.location, (res) => {
        const chunks = [];
        res.on('data',  (c) => chunks.push(c));
        res.on('end',   ()  => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      }).on('error', reject);
    });
  }

  if (file.path) return fs.promises.readFile(file.path);  // diskStorage

  throw new Error('Cannot read uploaded file: unknown storage type');
}

// ============================================================================
// POST /api/admin/schools/:id/logo
//
// Middleware order (sequence matters):
//   1. verifyFirebaseAuth  — sets req.user or 401
//   2. requireAdmin        — role check: PRINCIPAL or SUPER_ADMIN
//   3. preUploadTenantGuard — PRINCIPAL's schoolId must match :id param (NO DB)
//   4. logoUpload          — multer: validates MIME + size, writes to S3/disk
//   5. handleUploadError   — converts multer errors to JSON responses
//   6. async handler       — DB lookup, extraction, persist
// ============================================================================

router.post(
  '/:id/logo',

  // Steps 1–3: auth and ownership — must all pass before any bytes move
  verifyFirebaseAuth,
  requireAdmin,
  preUploadTenantGuard,

  // Step 4: accept and validate the file
  logoUpload,

  // Step 5: translate multer validation errors to JSON
  handleUploadError,

  // Step 6: main handler
  async (req, res) => {
    const prisma = req.prisma;

    // ── Confirm school record exists ─────────────────────────────────────────
    // We already verified the PRINCIPAL's schoolId matches req.params.id in
    // preUploadTenantGuard.  This DB fetch is still needed to get school.name
    // for the theme extraction appName fallback.
    const school = await prisma.school.findUnique({
      where:  { id: req.params.id },
      select: { id: true, name: true, isActive: true },
    });

    if (!school || !school.isActive) {
      return res.status(404).json({ error: 'School not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file received. Send an image under the "file" field.' });
    }

    // ── Public URL for the uploaded file ────────────────────────────────────
    const logoUrl = req.file.location
      || `${req.protocol}://${req.get('host')}/uploads/logos/${req.file.filename}`;

    // ── Validate and normalise the optional code field ───────────────────────
    let newCode; // undefined = don't touch the code column
    if (req.body.code && typeof req.body.code === 'string') {
      const slug = req.body.code.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

      if (slug.length < 2) {
        return res.status(400).json({ error: 'School code must be at least 2 characters.' });
      }
      if (slug.length > 60) {
        return res.status(400).json({ error: 'School code must be 60 characters or fewer.' });
      }

      // ── Reserved slug check ───────────────────────────────────────────────
      if (RESERVED_CODES.has(slug)) {
        return res.status(409).json({
          error: `"${slug}" is a reserved keyword and cannot be used as a school code. ` +
                 `Choose a more specific slug, e.g. "${slug}-school".`,
        });
      }

      newCode = slug;
    }

    // ── Extract brand theme ──────────────────────────────────────────────────
    // LAMBDA SWAP POINT: delete the block below; return 202 here instead.
    // The Lambda will call PATCH /internal/schools/:id/theme when done.
    let themeConfig = null;
    try {
      const imageBuffer = await getUploadedBuffer(req.file);
      themeConfig = await extractThemeFromBuffer(
        imageBuffer,
        req.body.appName || school.name,
        logoUrl,
      );
    } catch (extractErr) {
      // Non-fatal: persist the logo URL without colour extraction.
      console.error('[theme] Extraction failed, logo saved without theme:', extractErr.message);
    }

    // ── Build the update payload ─────────────────────────────────────────────
    const updateData = { logoUrl };
    if (themeConfig) {
      updateData.themeConfig   = themeConfig;
      // Keep legacy primaryColor in sync.  This is the ONLY place that writes
      // primaryColor in application code (seed.js writes it at setup time, but
      // every subsequent write goes through here).
      updateData.primaryColor  = themeConfig.primary;
    }
    if (newCode !== undefined) {
      updateData.code = newCode;
    }

    // ── Persist ──────────────────────────────────────────────────────────────
    let updated;
    try {
      updated = await prisma.school.update({
        where:  { id: req.params.id },
        data:   updateData,
        select: { id: true, code: true, name: true, logoUrl: true, themeConfig: true },
      });
    } catch (dbErr) {
      if (dbErr.code === 'P2002' && dbErr.meta?.target?.includes('code')) {
        return res.status(409).json({
          error: `School code "${newCode}" is already taken. Choose a different code.`,
        });
      }
      throw dbErr;
    }

    // ── Audit ─────────────────────────────────────────────────────────────────
    await prisma.auditLog.create({
      data: {
        userId:      req.user.id,
        action:      'school_logo_uploaded',
        targetTable: 'School',
        targetId:    req.params.id,
        details: {
          logoUrl,
          themeExtracted:     !!themeConfig,
          extractionFallback: themeConfig?._fallback ?? !themeConfig,
          codeSet:            !!newCode,
        },
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    return res.json({
      school:      updated,
      theme:       themeConfig,
      logoUrl,
      extractedAt: themeConfig?.extractedAt || null,
    });
  },
);

// ============================================================================
// GET /api/schools/:code/theme   (public — no auth)
// ============================================================================

router.get('/:code/theme', async (req, res) => {
  const prisma = req.prisma;
  const { code } = req.params;

  if (!code || typeof code !== 'string' || code.length > 80) {
    return res.status(400).json({ error: 'Invalid school code' });
  }

  const school = await prisma.school.findUnique({
    where:  { code: code.toLowerCase() },
    select: { id: true, name: true, logoUrl: true, themeConfig: true, isActive: true },
  });

  if (!school || !school.isActive) {
    return res.status(404).json({ error: 'School not found' });
  }

  const theme = school.themeConfig || {};

  const response = {
    primary:         theme.primary         || '#007AFF',
    secondary:       theme.secondary       || '#5856D6',
    accent:          theme.accent          || '#FF9500',
    textOnPrimary:   theme.textOnPrimary   || '#FFFFFF',
    textOnSecondary: theme.textOnSecondary || '#FFFFFF',
    textOnAccent:    theme.textOnAccent    || '#000000',
    logoUrl:         theme.logoUrl         || school.logoUrl || null,
    appName:         theme.appName         || school.name,
  };

  // 5-minute CDN/client cache, serve stale for up to 1 hour while revalidating
  res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
  return res.json(response);
});

module.exports = router;
