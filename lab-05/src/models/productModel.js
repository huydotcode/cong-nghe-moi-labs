const { dynamoDB } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const TABLE_NAME = "Products";

const Product = {
  getAll: async () => {
    const params = {
      TableName: TABLE_NAME,
    };
    const result = await dynamoDB.scan(params).promise();
    return result.Items;
  },

  getById: async (id) => {
    const params = {
      TableName: TABLE_NAME,
      Key: { id },
    };
    const result = await dynamoDB.get(params).promise();
    return result.Item;
  },

  create: async (product) => {
    const newProduct = {
      id: uuidv4(),
      ...product,
    };
    const params = {
      TableName: TABLE_NAME,
      Item: newProduct,
    };
    await dynamoDB.put(params).promise();
    return newProduct;
  },

  update: async (id, product) => {
    const params = {
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression:
        "set #name = :name, price = :price, url_image = :url_image",
      ExpressionAttributeNames: {
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":name": product.name,
        ":price": product.price,
        ":url_image": product.url_image,
      },
      ReturnValues: "ALL_NEW",
    };
    const result = await dynamoDB.update(params).promise();
    return result.Attributes;
  },

  delete: async (id) => {
    const params = {
      TableName: TABLE_NAME,
      Key: { id },
    };
    await dynamoDB.delete(params).promise();
  },
};

module.exports = Product;
