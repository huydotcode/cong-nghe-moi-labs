const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// GET /login - Show login page
router.get("/login", authController.getLogin);

// POST /login - Handle login
router.post("/login", authController.postLogin);

// GET /logout - Handle logout
router.get("/logout", authController.logout);

module.exports = router;
