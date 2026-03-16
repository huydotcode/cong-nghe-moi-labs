const { Router } = require("express")
const { productController } = require("../controllers/product.controller")
const { uploadMiddleware } = require("../middlewares/upload.middleware")

const productRouter = Router();

productRouter.get("/", productController.index);
productRouter.get("/create", productController.showCreateForm);
productRouter.post("/create", uploadMiddleware.single("image"), productController.create);
productRouter.get("/edit/:id", productController.showEditForm);
productRouter.post("/edit/:id", uploadMiddleware.single("image"), productController.update);
productRouter.post("/delete/:id", productController.delete);
productRouter.get("/:id", productController.getById);

module.exports = {
    productRouter,
}