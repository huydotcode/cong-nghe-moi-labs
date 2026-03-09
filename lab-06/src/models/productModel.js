const { docClient } = require("../config/awsConfig");
const {
    ScanCommand,
    PutCommand,
    GetCommand,
    DeleteCommand,
    UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "Products";

class Product {
    constructor({ ID, name, image, price, quantity }) {
        this.ID = ID;
        this.name = name;
        this.image = image || "";
        this.price = parseFloat(price);
        this.quantity = parseInt(quantity);
    }

    // Validate product data, returns array of error messages
    validate() {
        const errors = [];
        if (!this.ID || this.ID.trim() === "") {
            errors.push("Mã sản phẩm (ID) không được để trống.");
        }
        if (!this.name || this.name.trim() === "") {
            errors.push("Tên sản phẩm không được để trống.");
        }
        if (isNaN(this.price) || this.price <= 0) {
            errors.push("Giá sản phẩm phải lớn hơn 0.");
        }
        if (isNaN(this.quantity) || this.quantity < 0) {
            errors.push("Số lượng sản phẩm phải >= 0.");
        }
        return errors;
    }

    toItem() {
        return {
            ID: this.ID,
            name: this.name,
            image: this.image,
            price: this.price,
            quantity: this.quantity,
        };
    }

    // --- Static database methods ---

    static async getAll() {
        const command = new ScanCommand({ TableName: TABLE_NAME });
        const response = await docClient.send(command);
        return response.Items || [];
    }

    static async getById(id) {
        const command = new GetCommand({
            TableName: TABLE_NAME,
            Key: { ID: id },
        });
        const response = await docClient.send(command);
        return response.Item || null;
    }

    static async create(productData) {
        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: productData,
            ConditionExpression: "attribute_not_exists(ID)",
        });
        await docClient.send(command);
        return productData;
    }

    static async update(id, updates) {
        let updateExpression = "SET";
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

        updateExpression = updateExpression.slice(0, -1); // remove trailing comma

        const command = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { ID: id },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "ALL_NEW",
        });

        const response = await docClient.send(command);
        return response.Attributes;
    }

    static async delete(id) {
        const command = new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { ID: id },
        });
        await docClient.send(command);
    }

    static async search(keyword) {
        const command = new ScanCommand({
            TableName: TABLE_NAME,
            FilterExpression: "contains(#name, :keyword)",
            ExpressionAttributeNames: { "#name": "name" },
            ExpressionAttributeValues: { ":keyword": keyword },
        });
        const response = await docClient.send(command);
        return response.Items || [];
    }
}

module.exports = Product;