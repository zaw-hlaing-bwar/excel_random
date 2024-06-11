const AWS = require('aws-sdk');
require('dotenv').config();

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-southeast-1'
});

function uploadToS3(file) {
  const params = {
    Bucket: 'random-excel',
    Key: file.originalname,
    Body: file.buffer
  };

  return s3.upload(params).promise();
}

module.exports = uploadToS3;