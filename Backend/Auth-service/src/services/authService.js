const User = require("../models/user");
const Role = require("../models/role");
const Permission = require("../models/permission");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("../utils/generateToken");


const extractPermissions = (roles) => {
  const permSet = new Set();
  roles.forEach((role) => {
    role.permissions.forEach((perm) => {
      permSet.add(`${perm.resource}:${perm.action}`);
    });
  });
  return [...permSet];
};

// LOGIN
const loginUser = async (email, password) => {
  // Find user 
  const user = await User.findOne({ email })
    .select("+password +refreshToken")
    .populate({
      path: "roles",
      populate: { path: "permissions" }, // load permissions inside each role
    });

  // User not found 
  if (!user) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  // disabled users must NOT receive tokens
  if (!user.isActive) {
    const err = new Error("Account is disabled. Contact your administrator.");
    err.statusCode = 403;
    throw err;
  }

  // Compare entered password vs bcrypt hash in DB
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  // Build flat permission list from populated roles
  const permissions = extractPermissions(user.roles);

  // Sign tokens 
  const accessToken = generateAccessToken(user, permissions);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token 
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      isActive: user.isActive,
      roles: user.roles.map((r) => r.name),
      permissions,
    },
  };
};

// REFRESH TOKEN
const refreshAccessToken = async (token) => {
  // Verify token signature and expiry
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    const err = new Error("Invalid or expired refresh token");
    err.statusCode = 401;
    throw err;
  }

  // Must be a refresh type token, not an access token
  if (decoded.type !== "refresh") {
    const err = new Error("Token is not a refresh token");
    err.statusCode = 401;
    throw err;
  }

  // Find user and validate stored token (prevents reuse after logout)
  const user = await User.findById(decoded.sub)
    .select("+refreshToken")
    .populate({ path: "roles", populate: { path: "permissions" } });

  if (!user || user.refreshToken !== token) {
    const err = new Error("Refresh token is invalid or already used");
    err.statusCode = 401;
    throw err;
  }

  if (!user.isActive) {
    const err = new Error("Account is disabled");
    err.statusCode = 403;
    throw err;
  }

  // Issue new tokens (refresh token rotation)
  const permissions = extractPermissions(user.roles);
  const newAccessToken = generateAccessToken(user, permissions);
  const newRefreshToken = generateRefreshToken(user);

  // Update stored refresh token
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// LOGOUT
const logoutUser = async (userId) => {
  // Clear refresh token in DB — this revokes it (PDF bonus: token revocation)
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

// REGISTER
const registerUser = async (email, password, roleName) => {

  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    const err = new Error("User already exists");
    err.statusCode = 400;
    throw err;
  }

  const role = await Role.findOne({
    name: roleName.toLowerCase(),
  });

  if (!role) {
    const err = new Error("Role not found");
    err.statusCode = 404;
    throw err;
  }

  const user = await User.create({
    email: email.toLowerCase(),
    password,
    isActive: true,
    roles: [role._id],
  });

  return {
    id: user._id,
    email: user.email,
    roles: [role.name],
  };
};
module.exports = { loginUser, refreshAccessToken, logoutUser, registerUser };