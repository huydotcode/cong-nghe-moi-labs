const express = require("express");
const app = express();

const session = require("express-session");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  }),
);

// Middleware to make user available in views
app.use((req, res, next) => {
  res.locals.user = req.session.userId
    ? { username: req.session.username }
    : null;
  next();
});

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

const productRoutes = require("./routes/product.routes");
app.use("/", productRoutes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
