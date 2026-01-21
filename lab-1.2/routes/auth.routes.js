const express = require("express");
const router = express.Router();
const db = require("../db/mysql");

router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
  );

  if (rows.length > 0) {
    req.session.userId = rows[0].id;
    req.session.username = rows[0].username;
    res.redirect("/");
  } else {
    res.render("login", { error: "Invalid username or password" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
