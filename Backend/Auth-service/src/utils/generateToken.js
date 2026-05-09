const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

/**
 * PDF Token Validation Strategy — Option A (Recommended):
 * Auth Service signs JWT using PRIVATE key (RS256)
 * Resource Service validates using PUBLIC key only
 * → Resource Service NEVER needs to call Auth DB
 */

const MyprivateKey = fs.readFileSync(
  path.resolve(process.env.JWT_PRIVATE_KEY_PATH || "./src/keys/private.key"),
  "utf8"
);

const MypublicKey = fs.readFileSync(
  path.resolve(process.env.JWT_PUBLIC_KEY_PATH || "./src/keys/public.key"),
  "utf8"
);

/**
 * Generate short-lived access token
 * Permissions embedded in payload so Resource Service
 * can authorize without calling Auth DB
 */
const generateAccessToken = (user, permissions) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      // PDF: permissions format <resource>:<action>
      // e.g. ["orders:read", "orders:write", "orders:delete"]
      permissions,
    },
    MyprivateKey,
    {
      algorithm: "RS256", // asymmetric — Option A
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m", // PDF: short-lived
      issuer: "auth-service",
    }
  );
};

/**
 * Generate long-lived refresh token (PDF: optional but recommended)
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      type: "refresh",
    },
    MyprivateKey,
    {
      algorithm: "RS256",
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
      issuer: "auth-service",
    }
  );
};

/**
 * Verify token with public key (used by both services)
 */
const verifyToken = (token) => {
  return jwt.verify(token, MypublicKey, {
    algorithms: ["RS256"],
    issuer: "auth-service",
  });
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };