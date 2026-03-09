const Product = require("../models/productModel");
const s3Service = require("../services/s3Service");

const ITEMS_PER_PAGE = 5;

// GET / - Hiển thị danh sách sản phẩm (có phân trang)
const getProducts = async(req, res) => {
    try {
        const allProducts = await Product.getAll();
        const page = parseInt(req.query.page) || 1;
        const totalItems = allProducts.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
        const currentPage = Math.min(Math.max(page, 1), totalPages);
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const products = allProducts.slice(start, start + ITEMS_PER_PAGE);

        res.render("index", {
            products,
            currentPage,
            totalPages,
            searchQuery: "",
            error: null,
            success: req.query.success || null,
        });
    } catch (error) {
        console.error("Lỗi lấy danh sách sản phẩm:", error);
        res.status(500).render("error", {
            message: "Không thể tải danh sách sản phẩm.",
        });
    }
};

// GET /search - Tìm kiếm sản phẩm
const searchProducts = async(req, res) => {
    try {
        const keyword = (req.query.keyword || "").trim();
        if (!keyword) {
            return res.redirect("/");
        }

        const products = await Product.search(keyword);
        res.render("index", {
            products,
            currentPage: 1,
            totalPages: 1,
            searchQuery: keyword,
            error: null,
            success: null,
        });
    } catch (error) {
        console.error("Lỗi tìm kiếm sản phẩm:", error);
        res.status(500).render("error", {
            message: "Không thể tìm kiếm sản phẩm.",
        });
    }
};

// GET /add - Form thêm sản phẩm
const getAddProduct = (req, res) => {
    res.render("add", { error: null, product: {} });
};

// POST /add - Xử lý thêm sản phẩm
const createProduct = async(req, res) => {
    try {
        const { ID, name, price, quantity } = req.body;
        const file = req.file;

        const product = new Product({ ID, name, image: "", price, quantity });
        const errors = product.validate();

        if (errors.length > 0) {
            return res.render("add", {
                error: errors.join(" "),
                product: { ID, name, price, quantity },
            });
        }

        // Upload ảnh lên S3
        if (file) {
            try {
                product.image = await s3Service.uploadFile(file);
            } catch (uploadErr) {
                return res.render("add", {
                    error: "Upload ảnh thất bại: " + uploadErr.message,
                    product: { ID, name, price, quantity },
                });
            }
        }

        await Product.create(product.toItem());
        res.redirect("/?success=Thêm sản phẩm thành công!");
    } catch (error) {
        console.error("Lỗi thêm sản phẩm:", error);
        const msg =
            error.name === "ConditionalCheckFailedException" ?
            "Mã sản phẩm đã tồn tại." :
            "Không thể thêm sản phẩm: " + error.message;
        res.render("add", {
            error: msg,
            product: req.body,
        });
    }
};

// GET /edit/:id - Form sửa sản phẩm
const getEditProduct = async(req, res) => {
    try {
        const product = await Product.getById(req.params.id);
        if (!product) {
            return res.status(404).render("error", {
                message: "Không tìm thấy sản phẩm.",
            });
        }
        res.render("edit", { product, error: null });
    } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
        res.status(500).render("error", {
            message: "Không thể tải thông tin sản phẩm.",
        });
    }
};

// POST /edit/:id - Xử lý sửa sản phẩm
const updateProduct = async(req, res) => {
    try {
        const { id } = req.params;
        const { name, price, quantity } = req.body;
        const file = req.file;

        // Validate
        const tempProduct = new Product({
            ID: id,
            name,
            image: "",
            price,
            quantity,
        });
        const errors = tempProduct.validate();
        if (errors.length > 0) {
            const existing = await Product.getById(id);
            return res.render("edit", {
                product: {...existing, name, price, quantity },
                error: errors.join(" "),
            });
        }

        const updates = {
            name,
            price: parseFloat(price),
            quantity: parseInt(quantity),
        };

        if (file) {
            try {
                const newImageUrl = await s3Service.uploadFile(file);

                // Xóa ảnh cũ trên S3
                const existingProduct = await Product.getById(id);
                if (existingProduct && existingProduct.image) {
                    await s3Service.deleteFile(existingProduct.image);
                }

                updates.image = newImageUrl;
            } catch (uploadErr) {
                const existing = await Product.getById(id);
                return res.render("edit", {
                    product: existing,
                    error: "Upload ảnh mới thất bại: " + uploadErr.message,
                });
            }
        }

        await Product.update(id, updates);
        res.redirect("/?success=Cập nhật sản phẩm thành công!");
    } catch (error) {
        console.error("Lỗi cập nhật sản phẩm:", error);
        res.status(500).render("error", {
            message: "Không thể cập nhật sản phẩm: " + error.message,
        });
    }
};

// POST /delete/:id - Xóa sản phẩm
const deleteProduct = async(req, res) => {
    try {
        const { id } = req.params;

        // Xóa ảnh trên S3
        const product = await Product.getById(id);
        if (!product) {
            return res.status(404).render("error", {
                message: "Không tìm thấy sản phẩm để xóa.",
            });
        }
        if (product.image) {
            await s3Service.deleteFile(product.image);
        }

        await Product.delete(id);
        res.redirect("/?success=Xóa sản phẩm thành công!");
    } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        res.status(500).render("error", {
            message: "Không thể xóa sản phẩm: " + error.message,
        });
    }
};

module.exports = {
    getProducts,
    searchProducts,
    getAddProduct,
    createProduct,
    getEditProduct,
    updateProduct,
    deleteProduct,
};