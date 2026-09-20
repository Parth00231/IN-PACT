const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const User = require("../models/User");

// Default mock user when authentication is bypassed
const DEMO_USER = {
  _id: "64a000000000000000000001",
  name: "Dr. Rajesh Mehta, IAS",
  role: "admin",
  email: "admin@gnida.in",
  department: "GNIDA - Central Command & Administration",
  designation: "District Magistrate & Municipal Commissioner",
};

// Verifies the JWT from the Authorization header and attaches req.user.
// (Bypassed: if no token or invalid, assigns demo user and proceeds)
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret_key");
      req.user = await User.findById(decoded.id).select("-password");
    } catch (err) {
      // Ignore token errors and use demo user
    }
  }

  if (!req.user) {
    req.user = DEMO_USER;
  }
  next();
});

// Restricts a route to one or more roles (Bypassed for open demo access)
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    req.user = DEMO_USER;
  }
  next();
};

// Optional auth
const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret_key");
      req.user = await User.findById(decoded.id).select("-password");
    } catch (err) {
      // Ignore
    }
  }
  if (!req.user) {
    req.user = DEMO_USER;
  }
  next();
});

module.exports = { protect, authorize, optionalAuth };

