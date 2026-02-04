const authService = require("../services/authService");

/**
 * Render login page
 */
const getLogin = (req, res) => {
  // If already logged in, redirect to home
  if (req.session && req.session.user) {
    return res.redirect("/");
  }

  res.render("login", { error: null });
};

/**
 * Handle login form submission
 */
const postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.render("login", {
        error: "Please enter both username and password",
      });
    }

    // Authenticate user
    const user = await authService.authenticate(username, password);

    if (!user) {
      return res.render("login", {
        error: "Invalid username or password",
      });
    }

    // Create session
    req.session.user = user;

    // Redirect to home page
    res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    res.render("login", {
      error: "An error occurred. Please try again.",
    });
  }
};

/**
 * Handle logout
 */
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/login");
  });
};

module.exports = {
  getLogin,
  postLogin,
  logout,
};
