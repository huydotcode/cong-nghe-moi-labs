require("dotenv").config()
const express = require("express")
const path = require("path");
const { productRouter } = require("./routes/product.route")
const { productModel } = require("./models/product.model")

const app = express()
const PORT = process.env.PORT || 5000;

// Config
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "../public")))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

productModel.createTable();

app.get("/", (_, res) => {
    res.redirect("/products");
})

app.use("/products", productRouter)

app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
})