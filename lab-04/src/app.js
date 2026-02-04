const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const session = require("express-session");

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

// Session configuration
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Make user available to all views
const { attachUserToLocals } = require("./middlewares/authMiddleware");
app.use(attachUserToLocals);

// Auth routes (public - no auth required)
const authRoutes = require("./routes/authRoutes");
app.use("/", authRoutes);

// Protected routes
const { requireAuth } = require("./middlewares/authMiddleware");

// Product routes
const productRoutes = require("./routes/productRoutes");
app.use("/", requireAuth, productRoutes);

// Category routes
const categoryRoutes = require("./routes/categoryRoutes");
app.use("/categories", categoryRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
