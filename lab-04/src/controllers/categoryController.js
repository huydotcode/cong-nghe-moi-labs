const categoryService = require("../services/categoryService");

/**
 * Display list of categories
 */
const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.render("categories/index", { categories });
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res.status(500).send("Error retrieving categories");
  }
};

/**
 * Render Add Category Form
 */
const getAddCategory = (req, res) => {
  res.render("categories/add", { error: null });
};

/**
 * Handle Add Category
 */
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === "") {
      return res.render("categories/add", {
        error: "Category name is required",
      });
    }

    await categoryService.createCategory({ name, description });
    res.redirect("/categories");
  } catch (error) {
    console.error("Error creating category:", error);
    res.render("categories/add", {
      error: "Error creating category",
    });
  }
};

/**
 * Render Edit Category Form
 */
const getEditCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).send("Category not found");
    }

    res.render("categories/edit", { category, error: null });
  } catch (error) {
    console.error("Error retrieving category:", error);
    res.status(500).send("Error retrieving category");
  }
};

/**
 * Handle Update Category
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || name.trim() === "") {
      const category = await categoryService.getCategoryById(id);
      return res.render("categories/edit", {
        category,
        error: "Category name is required",
      });
    }

    await categoryService.updateCategory(id, { name, description });
    res.redirect("/categories");
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).send("Error updating category");
  }
};

/**
 * Handle Delete Category
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    res.redirect("/categories");
  } catch (error) {
    console.error("Error deleting category:", error);
    // Send error message back to user
    const categories = await categoryService.getAllCategories();
    res.render("categories/index", {
      categories,
      error: error.message,
    });
  }
};

module.exports = {
  getCategories,
  getAddCategory,
  createCategory,
  getEditCategory,
  updateCategory,
  deleteCategory,
};
