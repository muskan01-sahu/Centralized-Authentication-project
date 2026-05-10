const { sendError } = require("../utils/responseHandler");

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