const { dynamodb } = require("../config/db");

const params = {
  TableName: "Products",
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH" }, // Partition key
  ],
  AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

dynamodb.createTable(params, (err, data) => {
  if (err) {
    if (err.code === "ResourceInUseException") {
      console.log("Table already exists.");
    } else {
      console.error(
        "Unable to create table. Error JSON:",
        JSON.stringify(err, null, 2),
      );
    }
  } else {
    console.log(
      "Created table. Table description JSON:",
      JSON.stringify(data, null, 2),
    );
  }
});
