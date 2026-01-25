const db = require("../config/db");

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM Product ORDER BY created_at DESC",
    );
    res.render("index", { products: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Show create form
exports.getCreateForm = (req, res) => {
  res.render("create");
};

// Create new product
exports.createProduct = async (req, res) => {
  const { name, price, description, image_url } = req.body;
  try {
    await db.query(
      "INSERT INTO Product (name, price, description, image_url) VALUES (?, ?, ?, ?)",
      [name, price, description, image_url],
    );
    res.redirect("/products");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Show edit form
exports.getEditForm = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM Product WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).send("Product not found");
    }
    res.render("edit", { product: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, image_url } = req.body;
  try {
    await db.query(
      "UPDATE Product SET name = ?, price = ?, description = ?, image_url = ? WHERE id = ?",
      [name, price, description, image_url, id],
    );
    res.redirect("/products");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM Product WHERE id = ?", [id]);
    res.redirect("/products");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
