const Product = require("../models/productModel");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.render("index", { products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.getCreateProductForm = (req, res) => {
  res.render("form", { product: null });
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, url_image } = req.body;
    await Product.create({ name, price, url_image });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.getEditProductForm = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("form", { product });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, url_image } = req.body;
    await Product.update(req.params.id, { name, price, url_image });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.delete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
