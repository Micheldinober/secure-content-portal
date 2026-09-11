const express = require("express");

const {
  getUsers,
  updateUserRole,
} = require("../controllers/userController");

const {
  isAuthenticated,
  isAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// --------------------------------------------------
// Get All Users
// ADMIN ONLY
// --------------------------------------------------
router.get(
  "/",
  isAuthenticated,
  isAdmin,
  getUsers
);

// --------------------------------------------------
// Update User Role
// ADMIN ONLY
// --------------------------------------------------
router.patch(
  "/:id/role",
  isAuthenticated,
  isAdmin,
  updateUserRole
);

module.exports = router;