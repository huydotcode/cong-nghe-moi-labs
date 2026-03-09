const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
const productRoutes = require("./routes/productRoutes");
app.use("/", productRoutes);

// Multer error handling
app.use((err, req, res, next) => {
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).render("error", {
            message: "File ảnh vượt quá kích thước cho phép (tối đa 5MB).",
        });
    }
    if (err.message && err.message.includes("file ảnh")) {
        return res.status(400).render("error", { message: err.message });
    }
    console.error("Server error:", err);
    res.status(500).render("error", { message: "Đã xảy ra lỗi máy chủ." });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});