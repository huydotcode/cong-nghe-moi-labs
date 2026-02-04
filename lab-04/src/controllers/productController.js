const productService = require("../services/productService");
const categoryService = require("../services/categoryService");
const s3Service = require("../services/s3Service");

/**
 * Display list of products with filters and pagination
 */
const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, page = 1 } = req.query;

    const result = await productService.getAllProducts({
      categoryId: category,
      search,
      minPrice,
      maxPrice,
      page: parseInt(page),
      limit: 10,
    });

    // Get categories for filter dropdown
    const categories = await categoryService.getAllCategories();

    // Add inventory status to each product
    const productsWithStatus = result.items.map((product) => ({
      ...product,
      inventoryStatus: productService.getInventoryStatus(product.quantity),
    }));

    res.render("index", {
      products: productsWithStatus,
      pagination: result.pagination,
      categories,
      filters: { category, search, minPrice, maxPrice },
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).send("Error retrieving products");
  }
};

/**
 * Render Add Product Form
 */
const getAddProduct = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.render("add", { categories, error: null });
  } catch (error) {
    console.error("Error loading add form:", error);
    res.status(500).send("Error loading form");
  }
};

/**
 * Handle Add Product Logic
 */
const createProduct = async (req, res) => {
  try {
    const { name, price, quantity, categoryId } = req.body;
    const file = req.file;

    let url_image = "";
    if (file) {
      url_image = await s3Service.uploadFile(file);
    }

    await productService.createProduct(
      { name, price, quantity, categoryId, url_image },
      req.user.userId,
    );

    res.redirect("/");
  } catch (error) {
    console.error("Error creating product:", error);
    const categories = await categoryService.getAllCategories();
    res.render("add", {
      categories,
      error: "Error creating product",
    });
  }
};

/**
 * Render Edit Product Form
 */
const getEditProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const categories = await categoryService.getAllCategories();
    res.render("edit", { product, categories, error: null });
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).send("Error retrieving product");
  }
};

/**
 * Handle Update Product Logic
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity, categoryId } = req.body;
    const file = req.file;

    const updates = { name, price, quantity, categoryId };

    if (file) {
      // Upload new image
      const url_image = await s3Service.uploadFile(file);
      updates.url_image = url_image;
    }

    await productService.updateProduct(id, updates, req.user.userId);
    res.redirect("/");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Error updating product");
  }
};

/**
 * Handle Delete Product (Soft Delete)
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete - image is not removed from S3
    await productService.deleteProduct(id, req.user.userId);

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
