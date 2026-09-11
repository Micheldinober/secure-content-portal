const mongoose = require("mongoose");
const User = require("../models/User");

// --------------------------------------------------
// Get All Users - ADMIN ONLY
// --------------------------------------------------
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("_id name email profilePicture role createdAt")
      .sort({
        createdAt: -1,
      });

    return res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// --------------------------------------------------
// Change User Role - ADMIN ONLY
// --------------------------------------------------
const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    // Validate MongoDB ID
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Validate role
    if (!["admin", "viewer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message:
          "Role must be either admin or viewer",
      });
    }

    // Prevent admin from changing their own role
    if (req.user._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot change your own role",
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update role
    user.role = role;

    await user.save();

    return res.json({
      success: true,
      message: "User role updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Update user role error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
};

// --------------------------------------------------
// Export Controllers
// --------------------------------------------------
module.exports = {
  getUsers,
  updateUserRole,
};