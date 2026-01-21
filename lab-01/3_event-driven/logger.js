const EventEmitter = require("events");
const fs = require("fs");

class StudentLogger extends EventEmitter {}

const logger = new StudentLogger();

function logToFile(message) {
  const logMessage = `${new Date().toISOString()} - ${message}\n`;

  fs.appendFile("activity.log", logMessage, (err) => {
    if (err) {
      console.error("Error writing log:", err);
    }
  });
}

logger.on("login", (studentName) => {
  logToFile(`Student ${studentName} logged in`);
});

logger.on("view_lesson", (data) => {
  logToFile(`Student ${data.name} viewed lesson ${data.lesson}`);
});

logger.on("submit_assignment", (data) => {
  logToFile(`Student ${data.name} submitted assignment ${data.assignment}`);
});

module.exports = logger;
