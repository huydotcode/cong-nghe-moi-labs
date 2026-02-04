/**
 * Role-based Access Control Middleware
 * Check if user has required role(s)
 *
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles
 */
const requireRole = (allowedRoles) => {
  // Convert single role to array
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    const userRole = req.session.user.role;

    // Check if user has required role
    if (!roles.includes(userRole)) {
      return res.status(403).render("error", {
        message: "Access Denied",
        error: "You do not have permission to access this resource.",
      });
    }

    next();
  };
};

/**
 * Check if user is admin
 */
const requireAdmin = requireRole("admin");

/**
 * Allow both admin and staff
 */
const requireStaffOrAdmin = requireRole(["admin", "staff"]);

module.exports = {
  requireRole,
  requireAdmin,
  requireStaffOrAdmin,
};
