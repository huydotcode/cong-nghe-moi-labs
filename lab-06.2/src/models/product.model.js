const { CreateTableCommand } = require("@aws-sdk/client-dynamodb");
require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../config/dynamo");
const { ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = "Products";

class ProductModel {
    constructor() {}

    async createTable() {
        try {
            await docClient.send(new CreateTableCommand({
                TableName: TABLE_NAME,
                KeySchema: [{
                    AttributeName: "id",
                    KeyType: "HASH"
                }],
                AttributeDefinitions: [{
                    AttributeName: "id",
                    AttributeType: "S"
                }],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5,
                }
            }))

            console.log("Table created successfully");
        } catch (error) {
            if (error.name === "ResourceInUseException") {
                console.log("Table already exists");
            } else {
                console.log("Error creating table: ", error);
            }
        }
    }

    async getAllProducts() {
        const data = await docClient.send(new ScanCommand({
            TableName: TABLE_NAME,
        }))
        return data.Items || [];
    }

    async getProductById(id) {
        const data = await docClient.send(new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                id
            }
        }))
        return data.Item || null;
    }

    async addProduct(product) {
        await docClient.send(new PutCommand({
            TableName: TABLE_NAME,
            Item: product,
        }))
    }

    async updateProduct(id, updates) {
        await docClient.send(new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: "Set #name = :name, price = :price, unit_in_stock = :unit_in_stock, url_image = :url_image",
            ExpressionAttributeNames: {
                "#name": "name",
            },
            ExpressionAttributeValues: {
                ":name": updates.name,
                ":price": updates.price,
                ":unit_in_stock": updates.unit_in_stock,
                ":url_image": updates.url_image,
            }
        }))
    }

    async deleteProduct(id) {
        await docClient.send(new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { id },
        }));
    }
}

const productModel = new ProductModel();

module.exports = {
    productModel,
}