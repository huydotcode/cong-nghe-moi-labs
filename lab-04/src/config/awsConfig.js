const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { S3Client } = require("@aws-sdk/client-s3");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const dotenv = require("dotenv");

dotenv.config();

const region = process.env.AWS_REGION;

// AWS Credentials are automatically loaded from process.env (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
// or from ~/.aws/credentials if not present in env.
// This supports both local development and EC2 IAM Roles (if env vars are empty, SDK tries other providers).

const dynamoClient = new DynamoDBClient({ region });
const s3Client = new S3Client({ region });

const docClient = DynamoDBDocumentClient.from(dynamoClient);

module.exports = {
  s3Client,
  docClient,
};
