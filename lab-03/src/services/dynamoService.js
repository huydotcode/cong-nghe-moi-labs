const { docClient } = require("../config/awsConfig");
const {
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "Products";

const getAllProducts = async () => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
  });
  const response = await docClient.send(command);
  return response.Items;
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
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: product,
  });
  await docClient.send(command);
  return product;
};

const deleteProduct = async (id) => {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { id },
  });
  await docClient.send(command);
};

const updateProduct = async (id, updates) => {
  // updates is an object with { name, price, quantity, url_image }
  // We construct UpdateExpression dynamically

  let updateExpression = "set";
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  Object.keys(updates).forEach((key, index) => {
    if (updates[key] !== undefined) {
      // For "name" which is a reserved word in DynamoDB, we use #name
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

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
};
