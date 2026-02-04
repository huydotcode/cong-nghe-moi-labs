const categoryRepository = require("../repositories/categoryRepository");
const productRepository = require("../repositories/productRepository");
const { randomUUID } = require("crypto");

/**
 * Get all categories
 */
const getAllCategories = async () => {
  return categoryRepository.getAll();
};

/**
 * Get category by ID
 */
const getCategoryById = async (categoryId) => {
  return categoryRepository.getById(categoryId);
};

/**
 * Create a new category
 */
const createCategory = async (categoryData) => {
  const newCategory = {
    categoryId: randomUUID(),
    name: categoryData.name,
    description: categoryData.description || "",
  };

  return categoryRepository.create(newCategory);
};

/**
 * Update a category
 */
const updateCategory = async (categoryId, updates) => {
  return categoryRepository.update(categoryId, updates);
};

/**
 * Delete a category
 * @throws {Error} if category has products
 */
const deleteCategory = async (categoryId) => {
  // Check if category has products
  const productCount =
    await productRepository.countProductsByCategory(categoryId);

  if (productCount > 0) {
    throw new Error(
      `Cannot delete category: ${productCount} product(s) are using this category`,
    );
  }

  return categoryRepository.deleteCategory(categoryId);
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
