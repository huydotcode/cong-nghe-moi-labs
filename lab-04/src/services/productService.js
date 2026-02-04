const productRepository = require("../repositories/productRepository");
const auditService = require("./auditService");
const { randomUUID } = require("crypto");

/**
 * Get all products with filters and pagination
 */
const getAllProducts = async (options = {}) => {
  return productRepository.getAllProducts(options);
};

/**
 * Get product by ID
 */
const getProductById = async (id) => {
  return productRepository.getProductById(id);
};

/**
 * Create a new product
 */
const createProduct = async (productData, userId) => {
  const newProduct = {
    id: randomUUID(),
    name: productData.name,
    price: parseFloat(productData.price),
    quantity: parseInt(productData.quantity) || 0,
    categoryId: productData.categoryId || null,
    url_image: productData.url_image || "",
  };

  const created = await productRepository.createProduct(newProduct);

  // Audit log
  await auditService.logAction(created.id, auditService.ACTIONS.CREATE, userId);

  return created;
};

/**
 * Update a product
 */
const updateProduct = async (id, updates, userId) => {
  const sanitizedUpdates = {};

  if (updates.name !== undefined) sanitizedUpdates.name = updates.name;
  if (updates.price !== undefined)
    sanitizedUpdates.price = parseFloat(updates.price);
  if (updates.quantity !== undefined)
    sanitizedUpdates.quantity = parseInt(updates.quantity);
  if (updates.categoryId !== undefined)
    sanitizedUpdates.categoryId = updates.categoryId;
  if (updates.url_image !== undefined)
    sanitizedUpdates.url_image = updates.url_image;

  const updated = await productRepository.updateProduct(id, sanitizedUpdates);

  // Audit log
  await auditService.logAction(id, auditService.ACTIONS.UPDATE, userId);

  return updated;
};

/**
 * Soft delete a product
 */
const deleteProduct = async (id, userId) => {
  await productRepository.softDeleteProduct(id);

  // Audit log
  await auditService.logAction(id, auditService.ACTIONS.DELETE, userId);
};

/**
 * Get inventory status based on quantity
 */
const getInventoryStatus = (quantity) => {
  if (quantity === 0) {
    return { label: "Hết hàng", class: "danger" };
  } else if (quantity < 5) {
    return { label: "Sắp hết", class: "warning" };
  } else {
    return { label: "Còn hàng", class: "success" };
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getInventoryStatus,
};
