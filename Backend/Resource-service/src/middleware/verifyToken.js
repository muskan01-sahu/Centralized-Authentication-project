const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { sendError } = require("../utils/responseHandler");

/**
 * PDF Token Validation Strategy — Option A (Public Key Validation)
 *
 * Resource Service uses ONLY the PUBLIC KEY to verify the token.
 * It NEVER contacts the Auth Service or Auth database.
 * Permissions are read directly from the decoded JWT payload.
 *
 * PDF Rules enforced here:
 * → "Requests without valid tokens → 401 Unauthorized"
 * → "Token must be validated before accessing routes"
 */

// Load public key once at startup — never changes at runtime
// const publicKey = fs.readFileSync(
//   path.resolve(process.env.JWT_PUBLIC_KEY_PATH || "./src/keys/public.key"),
//   "utf8"
// );

const publicKey = process.env.JWT_PUBLIC_KEY_PATH.replace(/\\n/g, "\n");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No token provided → 401
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, 401, "Access token missing. Please login first.");
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify signature using public key (RS256 asymmetric algorithm)
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
      issuer: "auth-service",
    });

    // Attach decoded payload to request object for next middleware
    // decoded = { sub, email, permissions: ["orders:read", ...], iat, exp }
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return sendError(res, 401, "Access token has expired. Please refresh your token.");
    }
    return sendError(res, 401, "Invalid access token.");
  }
};

module.exports = { verifyToken };