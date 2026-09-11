const express = require("express");
const multer = require("multer");
const crypto = require("crypto");

const {
  uploadContent,
  getContents,
  downloadContent,
  deleteContent,
} = require("../controllers/contentController");

const {
  isAuthenticated,
  isAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// --------------------------------------------------
// Multer Storage
// --------------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const safeFileName =
      crypto.randomUUID() + ".pdf";

    cb(null, safeFileName);
  },
});

// --------------------------------------------------
// Multer Upload Configuration
// --------------------------------------------------
const upload = multer({
  storage,

  limits: {
    fileSize: 50 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

// --------------------------------------------------
// Upload Content
// ADMIN ONLY
// --------------------------------------------------
router.post(
  "/upload",
  isAuthenticated,
  isAdmin,
  upload.single("file"),
  uploadContent
);

// --------------------------------------------------
// Get All Content
// LOGGED-IN USERS
// --------------------------------------------------
router.get(
  "/",
  isAuthenticated,
  getContents
);

// --------------------------------------------------
// Download Content
// LOGGED-IN USERS
// --------------------------------------------------
router.get(
  "/:id/download",
  isAuthenticated,
  downloadContent
);

// --------------------------------------------------
// Delete Content
// ADMIN ONLY
// --------------------------------------------------
router.delete(
  "/:id",
  isAuthenticated,
  isAdmin,
  deleteContent
);

// --------------------------------------------------
// Multer / Route Error Handler
// --------------------------------------------------
router.use((err, req, res, next) => {
  console.error(
    "Content route error:",
    err
  );

  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message:
          "File size cannot exceed 50 MB",
      });
    }

    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  }

  // File filter errors
  if (err) {
    return res.status(400).json({
      success: false,
      message:
        err.message ||
        "File upload failed",
    });
  }

  next();
});

module.exports = router;