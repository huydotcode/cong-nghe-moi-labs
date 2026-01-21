const express = require("express");
const router = express.Router();
const db = require("../db/mysql");

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
};

// Home
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM products");
  res.render("products", {
    products: rows,
    user: req.session.userId ? { username: req.session.username } : null,
  });
});

// Add product
router.post("/add", requireAuth, async (req, res) => {
  const { name, price, quantity } = req.body;
  await db.query(
    "INSERT INTO products(name, price, quantity) VALUES (?, ?, ?)",
    [name, price, quantity],
  );
  res.redirect("/");
});

// Delete product
router.get("/delete/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM products WHERE id = ?", [id]);
  res.redirect("/");
});

// Edit product form
router.get("/edit/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
  if (rows.length === 0) return res.redirect("/");
  res.render("edit-product", { product: rows[0] });
});

// Update product
router.post("/edit/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;
  await db.query(
    "UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?",
    [name, price, quantity, id],
  );
  res.redirect("/");
});

module.exports = router;
