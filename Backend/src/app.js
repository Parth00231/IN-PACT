const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(helmet());

// Flexible CORS support for local development, Vercel deployments, and custom domains
const clientOrigin = process.env.CLIENT_ORIGIN;
const configuredOrigins = clientOrigin
  ? clientOrigin.split(",").map((s) => s.trim())
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      // If CLIENT_ORIGIN is explicitly "*" or empty, or match configured origins, or ends with vercel.app
      if (
        !clientOrigin ||
        clientOrigin === "*" ||
        configuredOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1")
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback to allow connection
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" })); // higher limit to allow base64 image uploads if needed
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => res.json({ success: true, status: "ok" }));
app.get("/health", (req, res) => res.json({ success: true, status: "ok" }));
app.get("/", (req, res) => res.json({ success: true, message: "IN-PACT API is running smoothly", version: "1.0.0" }));

// Primary API Routes
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

// Fallback Route Aliases (Handles requests with or without /api prefix)
app.use("/auth", authRoutes);
app.use("/issues", issueRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
