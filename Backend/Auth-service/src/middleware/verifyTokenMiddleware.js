const { verifyToken } = require("../utils/generateToken");
const { sendError } = require("../utils/responseHandler");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, 401, "Access token missing or malformed");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; 
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return sendError(res, 401, "Access token has expired");
    }
    return sendError(res, 401, "Invalid access token");
  }
};

module.exports = { protect };