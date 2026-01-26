const express = require("express");
const router = express.Router();
const multer = require("multer");
const productController = require("../controllers/productController");

// Multer setup for memory storage (S3 upload will handle the buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Read
router.get("/", productController.getProducts);

// Create
router.get("/add", productController.getAddProduct);
router.post("/add", upload.single("image"), productController.createProduct);

// Update
router.get("/edit/:id", productController.getEditProduct);
router.post(
  "/edit/:id",
  upload.single("image"),
  productController.updateProduct,
);

// Delete
router.post("/delete/:id", productController.deleteProduct);

module.exports = router;
