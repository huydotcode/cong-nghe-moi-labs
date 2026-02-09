const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.getAllProducts);
router.get("/create", productController.getCreateProductForm);
router.post("/create", productController.createProduct);
router.get("/edit/:id", productController.getEditProductForm);
router.post("/edit/:id", productController.updateProduct);
router.get("/delete/:id", productController.deleteProduct); // Using GET for simplicity in this lab, ideally DELETE

module.exports = router;
