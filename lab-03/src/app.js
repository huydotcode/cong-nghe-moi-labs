const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
const productRoutes = require("./routes/productRoutes");
app.use("/", productRoutes);

// app.get("/", (req, res) => {
//   // res.redirect('/products');
//   res.send("Welcome to Product Management App");
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
