const express = require("express");
const router = express.Router();
const multer = require("multer");
const productController = require("../controllers/productController");

// Multer: lưu file vào memory buffer để upload lên S3
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP)."));
        }
    },
});

// Danh sách sản phẩm
router.get("/", productController.getProducts);

// Tìm kiếm
router.get("/search", productController.searchProducts);

// Thêm sản phẩm
router.get("/add", productController.getAddProduct);
router.post("/add", upload.single("image"), productController.createProduct);

// Sửa sản phẩm
router.get("/edit/:id", productController.getEditProduct);
router.post(
    "/edit/:id",
    upload.single("image"),
    productController.updateProduct
);

// Xóa sản phẩm
router.post("/delete/:id", productController.deleteProduct);

module.exports = router;