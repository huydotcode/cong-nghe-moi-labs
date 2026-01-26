const { s3Client } = require("../config/awsConfig");
const { Upload } = require("@aws-sdk/lib-storage");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

const uploadFile = async (file) => {
  if (!BUCKET_NAME) {
    throw new Error("S3_BUCKET_NAME is not defined in .env");
  }

  const fileExtension = path.extname(file.originalname);
  const fileName = `${uuidv4()}${fileExtension}`;

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    },
  });

  await upload.done();

  // Construct public URL (assuming bucket is public or we permit public read via policy)
  // https://BUCKET_NAME.s3.REGION.amazonaws.com/KEY
  const region = process.env.AWS_REGION || "us-east-1";
  const url = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${fileName}`;
  return url;
};

const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;

  // Extract Key from URL
  // URL: https://BUCKET_NAME.s3.REGION.amazonaws.com/KEY
  // Simple extraction: assume last part is key
  const fileName = fileUrl.split("/").pop();

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    // We generally allow soft fail on delete image
  }
};

module.exports = {
  uploadFile,
  deleteFile,
};
