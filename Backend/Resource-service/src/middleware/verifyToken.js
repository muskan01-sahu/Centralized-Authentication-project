const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { sendError } = require("../utils/responseHandler");


const MypublicKey = fs.readFileSync(
  path.resolve(process.env.JWT_PUBLIC_KEY || "./src/keys/public.key"),
  "utf8"
);


// const MypublicKey = process.env.JWT_PUBLIC_KEY;;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No token provided → 401
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, 401, "Access token missing. Please login first.");
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify signature using public key (RS256 asymmetric algorithm)
    const decoded = jwt.verify(token, MypublicKey, {
      algorithms: ["RS256"],
      issuer: "auth-service",
    });

  
    req.user = decoded;
    next();
  } catch (err) {
  console.log("JWT VERIFY ERROR:", err);

  if (err.name === "TokenExpiredError") {
    return sendError(res, 401, "Access token has expired. Please refresh your token.");
  }

  return sendError(res, 401, "Invalid access token.");
}
};

module.exports = { verifyToken };