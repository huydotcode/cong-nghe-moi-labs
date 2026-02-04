const productLogRepository = require("../repositories/productLogRepository");
const { randomUUID } = require("crypto");

/**
 * Action types for audit logging
 */
const ACTIONS = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
};

/**
 * Log a product action
 * @param {string} productId - Product ID
 * @param {string} action - CREATE, UPDATE, DELETE
 * @param {string} userId - User who performed the action
 */
const logAction = async (productId, action, userId) => {
  try {
    const logData = {
      logId: randomUUID(),
      productId,
      action,
      userId,
    };

    await productLogRepository.createLog(logData);
  } catch (error) {
    // Log error but don't throw - audit logging should not break main flow
    console.error("Error logging action:", error);
  }
};

/**
 * Get logs for a specific product
 */
const getProductLogs = async (productId) => {
  return productLogRepository.getLogsByProductId(productId);
};

/**
 * Get all logs (for admin dashboard)
 */
const getAllLogs = async () => {
  return productLogRepository.getAllLogs();
};

module.exports = {
  ACTIONS,
  logAction,
  getProductLogs,
  getAllLogs,
};
