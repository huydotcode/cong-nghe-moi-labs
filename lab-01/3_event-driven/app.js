const logger = require("./logger");

logger.emit("login", "Alice");

logger.emit("view_lesson", {
  name: "Alice",
  lesson: "Node.js Events",
});

logger.emit("submit_assignment", {
  name: "Alice",
  assignment: "Lab 3",
});
