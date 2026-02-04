const express = require("express");
const router = express.Router();
const multer = require("multer");
const productController = require("../controllers/productController");
const { requireAdmin } = require("../middlewares/roleMiddleware");

// Multer setup for memory storage (S3 upload will handle the buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Read - All authenticated users
router.get("/", productController.getProducts);

// Create - Admin only
router.get("/add", requireAdmin, productController.getAddProduct);
router.post(
  "/add",
  requireAdmin,
  upload.single("image"),
  productController.createProduct,
);

// Update - Admin only
router.get("/edit/:id", requireAdmin, productController.getEditProduct);
router.post(
  "/edit/:id",
  requireAdmin,
  upload.single("image"),
  productController.updateProduct,
);

// Delete - Admin only
router.post("/delete/:id", requireAdmin, productController.deleteProduct);

module.exports = router;
