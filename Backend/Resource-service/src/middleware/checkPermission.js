const { sendError } = require("../utils/responseHandler");

/**
 * checkPermission(requiredPermission)
 *
 * PDF RBAC Rules:
 * → Authorization is permission-based
 * → Roles are mapped to permissions
 * → Resource services must NEVER query the Auth DB
 * → Authorization is enforced via middleware
 * → "Requests with insufficient permission → 403 Forbidden"
 *
 * How it works:
 * 1. verifyToken middleware already decoded the JWT and set req.user
 * 2. req.user.permissions = ["orders:read", "orders:write"] (from token)
 * 3. This middleware checks if requiredPermission is in that array
 * 4. If YES → next() (allow access)
 * 5. If NO  → 403 Forbidden
 *
 * Usage in routes:
 *   router.get("/orders", verifyToken, checkPermission("orders:read"), controller)
 *
 * PDF Permission format: <resource>:<action>
 * Examples: orders:read | orders:write | orders:delete
 */
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userPermissions = req.user?.permissions || [];

    if (!userPermissions.includes(requiredPermission)) {
      return sendError(
        res,
        403,
        `Forbidden. You need "${requiredPermission}" permission to access this resource.`
      );
    }

    next();
  };
};

module.exports = { checkPermission };