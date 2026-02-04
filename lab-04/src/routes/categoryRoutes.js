const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

// All routes require authentication
router.use(requireAuth);

// GET /categories - List all categories (all authenticated users)
router.get("/", categoryController.getCategories);

// GET /categories/add - Show add form (admin only)
router.get("/add", requireAdmin, categoryController.getAddCategory);

// POST /categories/add - Create category (admin only)
router.post("/add", requireAdmin, categoryController.createCategory);

// GET /categories/edit/:id - Show edit form (admin only)
router.get("/edit/:id", requireAdmin, categoryController.getEditCategory);

// POST /categories/edit/:id - Update category (admin only)
router.post("/edit/:id", requireAdmin, categoryController.updateCategory);

// POST /categories/delete/:id - Delete category (admin only)
router.post("/delete/:id", requireAdmin, categoryController.deleteCategory);

module.exports = router;
