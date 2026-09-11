const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const Content = require("../models/Content");

// --------------------------------------------------
// Upload Content - ADMIN ONLY
// --------------------------------------------------
const uploadContent = async (req, res) => {
  try {
    const title = req.body.title?.trim();

    if (!title) {
      if (req.file) {
        try {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
        } catch (fileError) {
          console.error(
            "Failed to remove uploaded file:",
            fileError
          );
        }
      }

      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (title.length > 200) {
      if (req.file) {
        try {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
        } catch (fileError) {
          console.error(
            "Failed to remove uploaded file:",
            fileError
          );
        }
      }

      return res.status(400).json({
        success: false,
        message: "Title must be 200 characters or less",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a file",
      });
    }

    const content = await Content.create({
      title,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
      isProtected: true,
    });

    const safeContent = {
      _id: content._id,
      title: content.title,
      originalName: content.originalName,
      fileType: content.fileType,
      fileSize: content.fileSize,
      isProtected: content.isProtected,
      createdAt: content.createdAt,
    };

    return res.status(201).json({
      success: true,
      message: "Content uploaded successfully",
      content: safeContent,
    });
  } catch (error) {
    console.error("Upload error:", error);

    if (req.file) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (fileError) {
        console.error(
          "Failed to remove uploaded file:",
          fileError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload content",
    });
  }
};

// --------------------------------------------------
// Get All Available Content - LOGGED-IN USERS
// --------------------------------------------------
const getContents = async (req, res) => {
  try {
    const contents = await Content.find()
      .select(
        "_id title originalName fileType fileSize isProtected createdAt"
      )
      .sort({
        createdAt: -1,
      });

    return res.json({
      success: true,
      contents,
    });
  } catch (error) {
    console.error("Fetch content error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch content",
    });
  }
};

// --------------------------------------------------
// Download Content - LOGGED-IN USERS
// --------------------------------------------------
const downloadContent = async (req, res) => {
  try {
    const contentId = req.params.id;

    if (!mongoose.isValidObjectId(contentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid content ID",
      });
    }

    const content = await Content.findById(contentId);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    const uploadsDirectory = path.resolve("uploads");

    const filePath = path.resolve(content.filePath);

    // Security check: only allow files inside uploads/
    if (
      filePath !== uploadsDirectory &&
      !filePath.startsWith(
        uploadsDirectory + path.sep
      )
    ) {
      console.error(
        "Blocked invalid file path:",
        content.filePath
      );

      return res.status(403).json({
        success: false,
        message: "Invalid file location",
      });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    return res.download(
      filePath,
      content.originalName,
      (error) => {
        if (error) {
          console.error(
            "File download error:",
            error
          );

          if (!res.headersSent) {
            return res.status(500).json({
              success: false,
              message: "Failed to download file",
            });
          }
        }
      }
    );
  } catch (error) {
    console.error("Download error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to access content",
      });
    }
  }
};

// --------------------------------------------------
// Delete Content - ADMIN ONLY
// --------------------------------------------------
const deleteContent = async (req, res) => {
  try {
    const contentId = req.params.id;

    // Validate MongoDB ObjectId
    if (!mongoose.isValidObjectId(contentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid content ID",
      });
    }

    // Find content
    const content = await Content.findById(contentId);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    // Resolve secure uploads directory
    const uploadsDirectory = path.resolve("uploads");

    // Resolve stored file path
    const filePath = path.resolve(content.filePath);

    // Security check:
    // Only allow deleting files inside uploads/
    if (
      filePath !== uploadsDirectory &&
      !filePath.startsWith(
        uploadsDirectory + path.sep
      )
    ) {
      console.error(
        "Blocked invalid delete path:",
        content.filePath
      );

      return res.status(403).json({
        success: false,
        message: "Invalid file location",
      });
    }

    // Delete physical file
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (fileError) {
        console.error(
          "Failed to delete physical file:",
          fileError
        );

        return res.status(500).json({
          success: false,
          message: "Failed to delete file from server",
        });
      }
    }

    // Delete MongoDB record
    await Content.findByIdAndDelete(contentId);

    return res.json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error) {
    console.error("Delete content error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete content",
    });
  }
};

// --------------------------------------------------
// Export Controllers
// --------------------------------------------------
module.exports = {
  uploadContent,
  getContents,
  downloadContent,
  deleteContent,
};