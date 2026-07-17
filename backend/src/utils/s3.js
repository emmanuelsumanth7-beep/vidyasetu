/**
 * s3.js
 *
 * Multer upload configurations for Vidya Setu.
 *
 * Two separate multer instances are exported:
 *   upload      — general-purpose single-file upload (existing behaviour)
 *   logoUpload  — logo-specific upload with strict MIME + size validation
 *
 * The logoUpload instance is intentionally separate so we never accidentally
 * loosen the logo constraints when modifying the general upload path, or vice
 * versa.
 */

'use strict';

const { S3Client } = require('@aws-sdk/client-s3');
const multer       = require('multer');
const multerS3     = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const fs           = require('fs');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID     || 'dummy_key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy_secret',
  },
});

// ── Shared constants ─────────────────────────────────────────────────────────

const LOGO_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

// MIME types accepted for school logos.
// We check BOTH the MIME type reported by the client AND the file extension,
// since a client could lie about the Content-Type.
// Note: we do NOT accept SVG — SVG files can contain embedded JS and would
// need a sanitisation pass before being served publicly.
const LOGO_ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);

const LOGO_ALLOWED_EXTS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp']);

/**
 * multer fileFilter that rejects non-image uploads.
 * Used by BOTH the S3 and local logo upload instances.
 */
function logoFileFilter(req, file, cb) {
  const mime = (file.mimetype || '').toLowerCase();
  const ext  = (file.originalname.split('.').pop() || '').toLowerCase();

  if (!LOGO_ALLOWED_MIMES.has(mime) || !LOGO_ALLOWED_EXTS.has(ext)) {
    return cb(
      Object.assign(new Error(
        `Invalid file type "${mime}". Only JPEG, PNG, GIF, and WebP images are accepted.`
      ), { status: 415 }),   // attach HTTP status so the route handler can use it
      false,
    );
  }
  cb(null, true);
}

// ── S3 storage factories ─────────────────────────────────────────────────────

function makeS3Storage(prefix) {
  return multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME || 'vidya-setu-bucket',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
    key: (req, file, cb) => {
      const ext = file.originalname.split('.').pop().toLowerCase();
      cb(null, `${prefix}/${uuidv4()}.${ext}`);
    },
  });
}

// ── Local storage factories ───────────────────────────────────────────────────

function makeLocalStorage(subdir) {
  const dir = `./uploads/${subdir}`;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename:    (req, file, cb) => {
      const ext = file.originalname.split('.').pop().toLowerCase();
      cb(null, `${uuidv4()}.${ext}`);
    },
  });
}

// ── Determine storage back-end ────────────────────────────────────────────────

const useS3 = !!(
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_S3_BUCKET_NAME
);

// ── General-purpose upload (unchanged behaviour) ─────────────────────────────
const _generalUploader = multer({
  storage: useS3 ? makeS3Storage('uploads') : makeLocalStorage('general'),
  // No size/type limits here intentionally — existing callers may upload
  // PDFs or other document types; keep their behaviour unchanged.
});

/**
 * General-purpose single-file upload middleware.
 * Caller receives the file under field name "file".
 * Existing routes depend on this exact field name.
 */
const upload = (req, res, next) =>
  _generalUploader.single('file')(req, res, next);

// ── Logo upload (strict validation) ──────────────────────────────────────────
const _logoUploader = multer({
  storage:    useS3 ? makeS3Storage('logos') : makeLocalStorage('logos'),
  fileFilter: logoFileFilter,
  limits: {
    fileSize:  LOGO_MAX_BYTES,
    files:     1,      // one file per request
    fields:    10,     // reasonable cap on form text fields
  },
});

/**
 * Logo-specific single-file upload middleware.
 * Accepts field name "file" (same as general upload for API consistency).
 * Enforces: JPEG/PNG/GIF/WebP only, ≤5 MB, single file.
 *
 * Multer errors (size exceeded, wrong type) are forwarded to next(err)
 * with a `.status` property attached so the route can return the correct
 * HTTP status code.
 */
const logoUpload = (req, res, next) => {
  _logoUploader.single('file')(req, res, (err) => {
    if (!err) return next();

    // Translate multer-specific errors into HTTP-friendly ones
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(
        Object.assign(
          new Error(`Logo file exceeds the 5 MB limit. Please compress the image and retry.`),
          { status: 413 },
        ),
      );
    }

    // fileFilter rejection or any other multer error — forward with status
    return next(
      Object.assign(err, { status: err.status || 400 }),
    );
  });
};

module.exports = {
  upload,
  logoUpload,
  s3Client,
  // Exposed for tests
  LOGO_MAX_BYTES,
  LOGO_ALLOWED_MIMES,
  LOGO_ALLOWED_EXTS,
};
