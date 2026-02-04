/**
 * Authentication Middleware
 * Check if user is logged in via session
 */
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/login");
  }

  // Attach user to request for easy access
  req.user = req.session.user;
  next();
};

/**
 * Middleware to make user available to all views
 */
const attachUserToLocals = (req, res, next) => {
  res.locals.user = req.session?.user || null;
  next();
};

module.exports = {
  requireAuth,
  attachUserToLocals,
};
