const { docClient } = require("../config/awsConfig");
const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.PRODUCT_LOGS_TABLE_NAME || "ProductLogs";

/**
 * Create a new audit log entry
 * @param {Object} logData
 * @param {string} logData.logId - UUID
 * @param {string} logData.productId - Product ID
 * @param {string} logData.action - CREATE, UPDATE, DELETE
 * @param {string} logData.userId - User who performed the action
 */
const createLog = async (logData) => {
  const logEntry = {
    ...logData,
    time: new Date().toISOString(),
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: logEntry,
  });

  await docClient.send(command);
  return logEntry;
};

/**
 * Get all logs for a specific product
 */
const getLogsByProductId = async (productId) => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: "productId = :productId",
    ExpressionAttributeValues: {
      ":productId": productId,
    },
  });

  const response = await docClient.send(command);
  // Sort by time descending
  const items = response.Items || [];
  return items.sort((a, b) => new Date(b.time) - new Date(a.time));
};

/**
 * Get all logs (for admin dashboard)
 */
const getAllLogs = async () => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
  });

  const response = await docClient.send(command);
  const items = response.Items || [];
  return items.sort((a, b) => new Date(b.time) - new Date(a.time));
};

module.exports = {
  createLog,
  getLogsByProductId,
  getAllLogs,
};
