const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title must be 200 characters or less"],
    },

    originalName: {
      type: String,
      required: [true, "Original filename is required"],
      trim: true,
    },

    fileName: {
      type: String,
      required: [true, "Filename is required"],
      trim: true,
    },

    filePath: {
      type: String,
      required: [true, "File path is required"],
      trim: true,
    },

    fileType: {
      type: String,
      required: [true, "File type is required"],
      trim: true,
      enum: {
        values: ["application/pdf"],
        message: "Only PDF files are allowed",
      },
    },

    fileSize: {
      type: Number,
      required: [true, "File size is required"],
      min: [1, "File cannot be empty"],
      max: [
        50 * 1024 * 1024,
        "File size cannot exceed 50 MB",
      ],
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploader is required"],
    },

    isProtected: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Content",
  contentSchema
);