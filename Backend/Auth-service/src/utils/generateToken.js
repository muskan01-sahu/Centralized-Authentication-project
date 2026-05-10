const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");


const MyprivateKey = fs.readFileSync(
  path.resolve(process.env.JWT_PRIVATE_KEY || "./src/keys/private.key"),
  "utf8"
);

const MypublicKey = fs.readFileSync(
  path.resolve(process.env.JWT_PUBLIC_KEY || "./src/keys/public.key"),
  "utf8"
);

// const MyprivateKey = process.env.JWT_PRIVATE_KEY.replace(/\\n/g, "\n");

// const MypublicKey = process.env.JWT_PUBLIC_KEY.replace(/\\n/g, "\n");



const generateAccessToken = (user, permissions) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
  
      // e.g. ["orders:read", "orders:write", "orders:delete"]
      permissions,
    },
    MyprivateKey,
    {
      algorithm: "RS256", 
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m", 
      issuer: "auth-service",
    }
  );
};


//   Generate long-lived refresh token 
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

// Verify token with public key (used by both services)
const verifyToken = (token) => {
  return jwt.verify(token, MypublicKey, {
    algorithms: ["RS256"],
    issuer: "auth-service",
  });
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };