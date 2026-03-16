const { productModel } = require("../models/product.model")
const uuid = require("uuid");

class ProductController {
    constructor() {}

    async index(req, res) {
        try {
            const { success, error, search } = req.query;
            let products = await productModel.getAllProducts();

            if (search) {
                const keyword = search.toLowerCase();
                products = products.filter(p => p.name && p.name.toLowerCase().includes(keyword));
            }

            res.render("products/index", { products, success, error, search: search || "" });
        } catch (error) {
            res.status(500).render("products/index", { products: [], success: null, error: "Lỗi tải dữ liệu sản phẩm", search: "" });
        }
    }

    async showCreateForm(req, res) {
        const { error } = req.query;
        res.render("products/create", { error });
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const { success, error } = req.query;
            const product = await productModel.getProductById(id);
            if (!product) {
                return res.status(404).render("products/detail", { error: "Không tìm thấy sản phẩm", success: null, product: null });
            }
            res.render("products/detail", { product, error, success });
        } catch (error) {
            res.status(500).render("products/detail", { error: "Lỗi khi tải trang chi tiết", success: null, product: null });
        }
    }

    async create(req, res) {
        try {
            const { name, price, unit_in_stock } = req.body;

            // Validate
            if (!name || name.trim() === "") {
                return res.redirect("/products/create?error=Tên sản phẩm không được để trống");
            }
            if (isNaN(price) || Number(price) < 0) {
                return res.redirect("/products/create?error=Giá sản phẩm phải là số hợp lệ và lớn hơn hoặc bằng 0");
            }
            if (isNaN(unit_in_stock) || Number(unit_in_stock) < 0) {
                return res.redirect("/products/create?error=Tồn kho phải là số hợp lệ và lớn hơn hoặc bằng 0");
            }

            let url_image = "";
            if (req.file) {
                url_image = `/uploads/${req.file.filename}`;
            }

            const newProduct = {
                id: uuid.v4(),
                name: name.trim(),
                price: parseFloat(price),
                unit_in_stock: parseInt(unit_in_stock, 10),
                url_image,
            };
            await productModel.addProduct(newProduct);
            res.redirect("/products?success=Thêm sản phẩm thành công");
        } catch (error) {
            console.error(error);
            res.redirect("/products/create?error=Đã xảy ra lỗi khi thêm sản phẩm");
        }
    }

    async showEditForm(req, res) {
        try {
            const { id } = req.params;
            const { error } = req.query;
            const product = await productModel.getProductById(id);
            if (!product) {
                return res.redirect("/products?error=Không tìm thấy sản phẩm để sửa");
            }
            res.render("products/edit", { product, error });
        } catch (error) {
            res.redirect("/products?error=Đã xảy ra lỗi tải form sửa");
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, price, unit_in_stock } = req.body;

            // Validate
            if (!name || name.trim() === "") {
                return res.redirect(`/products/edit/${id}?error=Tên sản phẩm không được để trống`);
            }
            if (isNaN(price) || Number(price) < 0) {
                return res.redirect(`/products/edit/${id}?error=Giá sản phẩm hợp lệ phải lớn hơn hoặc bằng 0`);
            }
            if (isNaN(unit_in_stock) || Number(unit_in_stock) < 0) {
                return res.redirect(`/products/edit/${id}?error=Tồn kho hợp lệ phải lớn hơn hoặc bằng 0`);
            }

            const existingProduct = await productModel.getProductById(id);
            if (!existingProduct) {
                return res.redirect("/products?error=Sản phẩm không tồn tại");
            }

            let url_image = existingProduct.url_image;

            if (req.file) {
                const fs = require('fs');
                const path = require('path');
                if (url_image) {
                    const oldImagePath = path.join(__dirname, '../../public', url_image);
                    if (fs.existsSync(oldImagePath)) {
                        try {
                            fs.unlinkSync(oldImagePath);
                        } catch (err) {
                            console.error("Failed to delete old image:", err);
                        }
                    }
                }
                url_image = `/uploads/${req.file.filename}`;
            }

            const updates = {
                name: name.trim(),
                price: parseFloat(price),
                unit_in_stock: parseInt(unit_in_stock, 10),
                url_image,
            };
            await productModel.updateProduct(id, updates);
            res.redirect("/products?success=Cập nhật thông tin sản phẩm thành công");
        } catch (error) {
            console.error(error);
            res.redirect(`/products/edit/${req.params.id}?error=Đã xảy ra lỗi khi cập nhật sản phẩm`);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const existingProduct = await productModel.getProductById(id);

            if (existingProduct && existingProduct.url_image) {
                const fs = require('fs');
                const path = require('path');
                const oldImagePath = path.join(__dirname, '../../public', existingProduct.url_image);
                if (fs.existsSync(oldImagePath)) {
                    try {
                        fs.unlinkSync(oldImagePath);
                    } catch (err) {
                        console.error("Failed to delete image on product delete:", err);
                    }
                }
            }

            await productModel.deleteProduct(id);
            res.redirect("/products?success=Đã xoá sản phẩm thành công");
        } catch (error) {
            console.error(error);
            res.redirect("/products?error=Đã xảy ra lỗi khi xoá sản phẩm");
        }
    }
}

const productController = new ProductController();

module.exports = {
    productController,
}