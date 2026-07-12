const AWS = require("aws-sdk");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEYY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const S3 = new AWS.S3();
const S3_BUCKET = "codehub-files";

module.exports = { S3, S3_BUCKET };
