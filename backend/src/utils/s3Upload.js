const AWS = require('aws-sdk');
require('dotenv').config();

// Configure the AWS SDK with credentials from .env
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-south-1', // Assuming ap-south-1 based on the RDS url
});

const s3 = new AWS.S3();

/**
 * Uploads a file buffer to the configured AWS S3 bucket.
 * 
 * @param {Buffer} fileBuffer - The file data to upload.
 * @param {string} fileName - The name/path to save the file as in S3.
 * @param {string} mimeType - The MIME type of the file (e.g., 'application/pdf').
 * @returns {Promise<string>} - The public URL of the uploaded file.
 */
async function uploadToS3(fileBuffer, fileName, mimeType) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!bucketName) {
    throw new Error('AWS_S3_BUCKET_NAME is not defined in .env');
  }

  const params = {
    Bucket: bucketName,
    Key: `uploads/${Date.now()}_${fileName}`, // Avoid naming collisions
    Body: fileBuffer,
    ContentType: mimeType,
    // Note: ACL 'public-read' requires the bucket to allow public ACLs.
    // If blocked, remove this and use CloudFront or presigned URLs.
    ACL: 'public-read' 
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location; // The URL of the uploaded file
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
}

module.exports = {
  uploadToS3
};
