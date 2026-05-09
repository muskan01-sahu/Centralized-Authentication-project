const { validationResult } = require("express-validator");
const authService = require("../services/authService");
const {
  sendSuccess,
  sendError,
} = require("../utils/responseHandler");

// ─── POST /auth/register ─────────────────────────────────────
const register = async (req, res) => {
  // validation middleware runs before this controller, so capture its results here
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 422, "Validation failed", errors.array());
  }

  try {

    const { email, password, role } = req.body;

    // check empty fields
    if (!email || !password || !role) {
      return sendError(
        res,
        400,
        "Email, password and role are required"
      );
    }

    // register service
    const user = await authService.registerUser(
      email,
      password,
      role
    );

    return sendSuccess(
      res,
      201,
      "Registration successful",
      user
    );

  } catch (err) {

    console.log("REGISTER ERROR:", err);

    return sendError(
      res,
      err.statusCode || 500,
      err.message || "Server Error"
    );
  }
};

// ─── POST /auth/login ────────────────────────────────────────
const login = async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return sendError(
      res,
      422,
      "Validation failed",
      errors.array()
    );
  }

  try {

    const { email, password } = req.body;

    console.log("LOGIN BODY:", req.body);

    // check empty fields
    if (!email || !password) {
      return sendError(
        res,
        400,
        "Email and password are required"
      );
    }

    // login service
    const result = await authService.loginUser(
      email,
      password
    );

    console.log("LOGIN RESULT:", result);

    // Ensure tokens exist
    if (
      !result ||
      !result.refreshToken ||
      !result.accessToken
    ) {
      return sendError(
        res,
        500,
        "Token generation failed"
      );
    }

    // Store refresh token in cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(
      res,
      200,
      "Login successful",
      {
        accessToken: result.accessToken,
        user: result.user,
      }
    );

  } catch (err) {

    console.log("LOGIN ERROR:", err);

    return sendError(
      res,
      err.statusCode || 500,
      err.message || "Server Error"
    );
  }
};

// ─── POST /auth/refresh ──────────────────────────────────────
const refresh = async (req, res) => {
  try {

    const token =
      req.cookies?.refreshToken ||
      req.body?.refreshToken;

    if (!token) {
      return sendError(
        res,
        401,
        "Refresh token is missing"
      );
    }

    const result =
      await authService.refreshAccessToken(token);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(
      res,
      200,
      "Token refreshed successfully",
      {
        accessToken: result.accessToken,
      }
    );

  } catch (err) {

    console.log("REFRESH ERROR:", err);

    return sendError(
      res,
      err.statusCode || 500,
      err.message || "Server Error"
    );
  }
};

// ─── POST /auth/logout ───────────────────────────────────────
const logout = async (req, res) => {
  try {

    if (req.user?.sub) {
      await authService.logoutUser(req.user.sub);
    }

    res.clearCookie("refreshToken");

    return sendSuccess(
      res,
      200,
      "Logged out successfully"
    );

  } catch (err) {

    console.log("LOGOUT ERROR:", err);

    return sendError(
      res,
      500,
      err.message || "Server Error"
    );
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};