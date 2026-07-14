const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy_key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy_secret',
  },
  // Use a custom endpoint if you're using localstack, else defaults to standard AWS.
});

// Using multer-s3 to stream files directly to S3
const uploadToS3 = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME || 'vidya-setu-bucket',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const ext = file.originalname.split('.').pop();
      const filename = `${uuidv4()}.${ext}`;
      cb(null, filename);
    }
  })
});

// A fallback local storage configuration just in case AWS is not configured during demo
const localUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const ext = file.originalname.split('.').pop();
      cb(null, `${uuidv4()}.${ext}`);
    }
  })
});

// Middleware that decides which uploader to use based on env variables
const upload = (req, res, next) => {
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_S3_BUCKET_NAME) {
    return uploadToS3.single('file')(req, res, next);
  } else {
    // Make sure uploads directory exists
    const fs = require('fs');
    if (!fs.existsSync('./uploads')) {
      fs.mkdirSync('./uploads');
    }
    return localUpload.single('file')(req, res, next);
  }
};

module.exports = {
  upload,
  s3Client
};
