const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/products", productController.getAllProducts);
router.get("/products/create", productController.getCreateForm);
router.post("/products/create", productController.createProduct);
router.get("/products/edit/:id", productController.getEditForm);
router.put("/products/update/:id", productController.updateProduct);
router.delete("/products/delete/:id", productController.deleteProduct);

// Redirect root to products
router.get("/", (req, res) => {
  res.redirect("/products");
});

module.exports = router;
