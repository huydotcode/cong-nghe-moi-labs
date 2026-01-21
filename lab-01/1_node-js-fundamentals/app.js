const mathUtils = require("./mathUtils");
const greeting = require("./greeting");

// Task 1
console.log("Hello Node.js!");

// Task 2
console.log("Add:", mathUtils.add(5, 3));
console.log("Subtract:", mathUtils.subtract(10, 4));
console.log("Multiply:", mathUtils.multiply(6, 7));

greeting.sayHello("Huy");
