const { docClient } = require("../config/awsConfig");
const {
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.USERS_TABLE_NAME || "Users";

const findByUsername = async (username) => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: "username = :username",
    ExpressionAttributeValues: {
      ":username": username,
    },
  });

  const response = await docClient.send(command);
  return response.Items?.[0] || null;
};

const findById = async (userId) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { userId },
  });
  const response = await docClient.send(command);
  return response.Item;
};

const getAll = async () => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
  });
  const response = await docClient.send(command);
  return response.Items || [];
};

const create = async (user) => {
  const userWithDefaults = {
    ...user,
    createdAt: new Date().toISOString(),
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: userWithDefaults,
  });
  await docClient.send(command);
  return userWithDefaults;
};

const update = async (userId, updates) => {
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
    Key: { userId },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  });

  const response = await docClient.send(command);
  return response.Attributes;
};

const deleteUser = async (userId) => {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { userId },
  });
  await docClient.send(command);
};

module.exports = {
  findByUsername,
  findById,
  getAll,
  create,
  update,
  deleteUser,
};
