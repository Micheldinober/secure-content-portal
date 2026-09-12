require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const passport = require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const contentRoutes = require("./routes/contentRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// --------------------------------------------------
// Environment Variables
// --------------------------------------------------

const PORT = process.env.PORT || 5000;

const MONGODB_URI = process.env.MONGODB_URI;

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

const NODE_ENV =
  process.env.NODE_ENV || "development";

const IS_PRODUCTION =
  NODE_ENV === "production";

// --------------------------------------------------
// Check MongoDB URI
// --------------------------------------------------

if (!MONGODB_URI) {
  console.error(
    "ERROR: MONGODB_URI is not defined."
  );

  process.exit(1);
}

// --------------------------------------------------
// Trust Render Proxy
// --------------------------------------------------

if (IS_PRODUCTION) {
  app.set("trust proxy", 1);
}

// --------------------------------------------------
// CORS
// --------------------------------------------------

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// --------------------------------------------------
// Body Parsers
// --------------------------------------------------

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// --------------------------------------------------
// Session
// --------------------------------------------------

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "secure-content-portal-secret",

    resave: false,

    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: "sessions",
    }),

    cookie: {
      httpOnly: true,

      // HTTPS is required for production cookies
      secure: IS_PRODUCTION,

      // Needed because frontend and backend
      // are on different domains after deployment
      sameSite: IS_PRODUCTION ? "none" : "lax",

      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// --------------------------------------------------
// Passport
// --------------------------------------------------

app.use(passport.initialize());

app.use(passport.session());

// --------------------------------------------------
// API Routes
// --------------------------------------------------

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/content",
  contentRoutes
);

app.use(
  "/api/users",
  userRoutes
);

// --------------------------------------------------
// Health Check
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Secure Content Portal API is running",
    environment: NODE_ENV,
  });
});

// --------------------------------------------------
// 404
// --------------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// --------------------------------------------------
// Global Error Handler
// --------------------------------------------------

app.use(
  (err, req, res, next) => {
    console.error(
      "Server error:",
      err
    );

    if (res.headersSent) {
      return next(err);
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);

// --------------------------------------------------
// Start Server
// --------------------------------------------------

const startServer = async () => {
  try {
    console.log(
      "Connecting to MongoDB..."
    );

    await mongoose.connect(
      MONGODB_URI,
      {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      }
    );

    console.log(
      "MongoDB connected successfully"
    );

    app.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log(
          `Server running on port ${PORT}`
        );

        console.log(
          `Frontend URL: ${FRONTEND_URL}`
        );

        // ADDED: Google OAuth callback URL
        console.log(
          `Google Callback URL: ${process.env.GOOGLE_CALLBACK_URL}`
        );

        console.log(
          `Environment: ${NODE_ENV}`
        );
      }
    );
  } catch (error) {
    console.error(
      "MongoDB connection failed:"
    );

    console.error(
      error.message
    );

    process.exit(1);
  }
};

startServer();