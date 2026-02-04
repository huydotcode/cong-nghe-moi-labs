const { docClient } = require("../config/awsConfig");
const {
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.CATEGORIES_TABLE_NAME || "Categories";

const getAll = async () => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
  });
  const response = await docClient.send(command);
  return response.Items || [];
};

const getById = async (categoryId) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { categoryId },
  });
  const response = await docClient.send(command);
  return response.Item;
};

const create = async (category) => {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: category,
  });
  await docClient.send(command);
  return category;
};

const update = async (categoryId, updates) => {
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

  updateExpression = updateExpression.slice(0, -1);

  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { categoryId },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  });

  const response = await docClient.send(command);
  return response.Attributes;
};

const deleteCategory = async (categoryId) => {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { categoryId },
  });
  await docClient.send(command);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteCategory,
};
