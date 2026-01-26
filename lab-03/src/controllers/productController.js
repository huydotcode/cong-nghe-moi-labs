const dynamoService = require("../services/dynamoService");
const s3Service = require("../services/s3Service");
const { v4: uuidv4 } = require("uuid");

// Display list of products
const getProducts = async (req, res) => {
  try {
    const products = await dynamoService.getAllProducts();
    res.render("index", { products });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).send("Error retrieving products");
  }
};

// Render Add Product Form
const getAddProduct = (req, res) => {
  res.render("add");
};

// Handle Add Product Logic
const createProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    const file = req.file;

    let url_image = "";
    if (file) {
      url_image = await s3Service.uploadFile(file);
    }

    const newProduct = {
      id: uuidv4(),
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      url_image,
    };

    await dynamoService.createProduct(newProduct);
    res.redirect("/");
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Error creating product");
  }
};

// Render Edit Product Form
const getEditProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await dynamoService.getProductById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("edit", { product });
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).send("Error retrieving product");
  }
};

// Handle Update Product Logic
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity } = req.body;
    const file = req.file;

    const updates = {
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
    };

    if (file) {
      // Upload new image
      const url_image = await s3Service.uploadFile(file);
      updates.url_image = url_image;
      // Optionally: delete old image if we had the logic to fetch it first
    }

    await dynamoService.updateProduct(id, updates);
    res.redirect("/");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Error updating product");
  }
};

// Handle Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if we want to delete image from S3, we need to fetch product first
    const product = await dynamoService.getProductById(id);
    if (product && product.url_image) {
      await s3Service.deleteFile(product.url_image);
    }

    await dynamoService.deleteProduct(id);
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Error deleting product");
  }
};

module.exports = {
  getProducts,
  getAddProduct,
  createProduct,
  getEditProduct,
  updateProduct,
  deleteProduct,
};
