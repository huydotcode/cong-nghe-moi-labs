const { docClient } = require("../config/awsConfig");
const {
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "Products";

/**
 * Get all active products (not soft deleted)
 * @param {Object} options - Filter options
 * @param {string} options.categoryId - Filter by category
 * @param {string} options.search - Search by name
 * @param {number} options.minPrice - Minimum price
 * @param {number} options.maxPrice - Maximum price
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.limit - Items per page
 */
const getAllProducts = async (options = {}) => {
  const {
    categoryId,
    search,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
  } = options;

  // Base filter: exclude soft-deleted items
  let filterExpression =
    "(attribute_not_exists(isDeleted) OR isDeleted = :false)";
  const expressionAttributeValues = { ":false": false };
  const expressionAttributeNames = {};

  // Category filter
  if (categoryId) {
    filterExpression += " AND categoryId = :categoryId";
    expressionAttributeValues[":categoryId"] = categoryId;
  }

  // Search by name (contains)
  if (search) {
    filterExpression += " AND contains(#name, :search)";
    expressionAttributeNames["#name"] = "name";
    expressionAttributeValues[":search"] = search;
  }

  // Price range filter
  if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
    filterExpression += " AND price >= :minPrice";
    expressionAttributeValues[":minPrice"] = parseFloat(minPrice);
  }

  if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
    filterExpression += " AND price <= :maxPrice";
    expressionAttributeValues[":maxPrice"] = parseFloat(maxPrice);
  }

  const command = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: filterExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ...(Object.keys(expressionAttributeNames).length > 0 && {
      ExpressionAttributeNames: expressionAttributeNames,
    }),
  });

  const response = await docClient.send(command);
  const items = response.Items || [];

  // Calculate pagination (client-side for Scan)
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const paginatedItems = items.slice(startIndex, startIndex + limit);

  return {
    items: paginatedItems,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

const getProductById = async (id) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { id },
  });
  const response = await docClient.send(command);
  return response.Item;
};

const createProduct = async (product) => {
  const productWithDefaults = {
    ...product,
    isDeleted: false,
    createdAt: new Date().toISOString(),
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: productWithDefaults,
  });
  await docClient.send(command);
  return productWithDefaults;
};

/**
 * Soft delete a product
 */
const softDeleteProduct = async (id) => {
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: "set isDeleted = :isDeleted",
    ExpressionAttributeValues: {
      ":isDeleted": true,
    },
    ReturnValues: "ALL_NEW",
  });

  const response = await docClient.send(command);
  return response.Attributes;
};

/**
 * Hard delete a product (for cleanup purposes)
 */
const deleteProduct = async (id) => {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { id },
  });
  await docClient.send(command);
};

const updateProduct = async (id, updates) => {
  let updateExpression = "set";
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  Object.keys(updates).forEach((key) => {
    if (updates[key] !== undefined) {
      const attrName = `#${key}`;
      const attrValue = `:${key}`;

      updateExpression += ` ${attrName} = ${attrValue},`;
      expressionAttributeNames[attrName] = key;
      expressionAttributeValues[attrValue] = updates[key];
    }
  });

  // Remove trailing comma
  updateExpression = updateExpression.slice(0, -1);

  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  });

  const response = await docClient.send(command);
  return response.Attributes;
};

/**
 * Get products by category ID
 */
const getProductsByCategory = async (categoryId) => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression:
      "categoryId = :categoryId AND (attribute_not_exists(isDeleted) OR isDeleted = :false)",
    ExpressionAttributeValues: {
      ":categoryId": categoryId,
      ":false": false,
    },
  });

  const response = await docClient.send(command);
  return response.Items || [];
};

/**
 * Count products in a category (for validation before deleting category)
 */
const countProductsByCategory = async (categoryId) => {
  const products = await getProductsByCategory(categoryId);
  return products.length;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
  softDeleteProduct,
  updateProduct,
  getProductsByCategory,
  countProductsByCategory,
};
