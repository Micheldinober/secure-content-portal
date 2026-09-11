import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    setError("");
    setMessage("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setError("File size must be less than 50 MB.");
      setFile(null);
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!title.trim()) {
      setError("Please enter a content title.");
      return;
    }

    if (!file) {
      setError("Please select a file.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("file", file);

      const response = await fetch(
        "http://localhost:5000/api/content/upload",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to upload content."
        );
      }

      setMessage("Content uploaded successfully.");

      setTitle("");
      setFile(null);

      const fileInput =
        document.getElementById("content-file");

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Something went wrong while uploading."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">

      {/* Background decorations */}
      <div className="upload-bg upload-bg-one"></div>
      <div className="upload-bg upload-bg-two"></div>
      <div className="upload-bg upload-bg-three"></div>

      {/* Main Card */}
      <div className="upload-card">

        {/* Back Button */}
        <div className="back-section">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            <span className="back-arrow">←</span>
            Back to Dashboard
          </button>
        </div>

        {/* Header */}
        <div className="upload-header">

          <div className="upload-logo">
            🔐
          </div>

          <h1 className="upload-title">
            Upload Content
          </h1>

          <p className="upload-subtitle">
            Upload your files securely to the content portal.
          </p>

        </div>

        {/* Form */}
        <form
          className="upload-form"
          onSubmit={handleUpload}
        >

          {/* Content Title */}
          <div className="form-group">

            <label
              htmlFor="content-title"
              className="form-label"
            >
              Content Title
            </label>

            <input
              id="content-title"
              type="text"
              className="title-input"
              placeholder="Enter content title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
                setMessage("");
              }}
              disabled={loading}
            />

          </div>

          {/* Select File */}
          <div className="form-group file-group">

            <label className="form-label">
              Select File
            </label>

            <label
              htmlFor="content-file"
              className={`file-area ${
                file ? "selected" : ""
              }`}
            >

              <div className="file-icon">
                {file ? "📄" : "📁"}
              </div>

              <div className="file-details">

                <span className="file-name">
                  {file
                    ? file.name
                    : "Choose a file"}
                </span>

                <span className="file-info">
                  {file
                    ? formatFileSize(file.size)
                    : "Click to browse your files"}
                </span>

              </div>

              <div className="browse-button">
                Browse
              </div>

            </label>

            <input
              id="content-file"
              type="file"
              className="file-input"
              onChange={handleFileChange}
              disabled={loading}
            />

            <small className="file-limit">
              Maximum file size: 50 MB
            </small>

          </div>

          {/* Error */}
          {error && (
            <div className="error-message">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="success-message">
              <span>✓</span>
              <span>{message}</span>
            </div>
          )}

          {/* Upload Button */}
          <button
            type="submit"
            className="upload-button"
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="spinner"></span>
                Uploading...
              </>
            ) : (
              <>
                <span>🔐</span>
                Upload Securely
              </>
            )}

          </button>

        </form>

        {/* Security Note */}
        <div className="security-note">

          <div className="security-icon">
            🛡️
          </div>

          <div>
            <strong className="security-title">
              Secure & Protected
            </strong>

            <p className="security-text">
              Your uploaded content is securely stored
              and protected.
            </p>
          </div>

        </div>

      </div>


      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        body {
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
        }


        /* =====================================================
           PAGE
        ===================================================== */

        .upload-page {
          position: fixed;

          inset: 0;

          width: 100vw;
          height: 100vh;

          display: flex;

          align-items: center;
          justify-content: center;

          padding: 20px;

          overflow: hidden;

          background:
            radial-gradient(
              circle at 80% 15%,
              rgba(87, 64, 233, 0.10),
              transparent 25%
            ),
            radial-gradient(
              circle at 10% 90%,
              rgba(49, 107, 242, 0.10),
              transparent 27%
            ),
            linear-gradient(
              135deg,
              #f3f7ff 0%,
              #f9fbff 100%
            );
        }


        /* =====================================================
           BACKGROUND CIRCLES
        ===================================================== */

        .upload-bg {
          position: absolute;

          border-radius: 50%;

          pointer-events: none;

          z-index: 0;
        }

        .upload-bg-one {
          width: 350px;
          height: 350px;

          top: -220px;
          left: -160px;

          background:
            rgba(49, 107, 242, 0.055);
        }

        .upload-bg-two {
          width: 480px;
          height: 480px;

          right: -270px;
          bottom: -280px;

          background:
            rgba(87, 64, 233, 0.065);
        }

        .upload-bg-three {
          width: 190px;
          height: 190px;

          right: 17%;
          top: 70px;

          background:
            rgba(87, 64, 233, 0.035);
        }


        /* =====================================================
           MAIN CARD
        ===================================================== */

        .upload-card {
          position: relative;

          z-index: 5;

          width: 720px;

          max-width: calc(100vw - 40px);

          /*
           * IMPORTANT:
           * No min-height here.
           * This keeps the card inside the viewport.
           */

          height: auto;

          max-height: calc(100vh - 40px);

          padding: 27px 48px 24px;

          background: #ffffff;

          border: 1px solid #dfe6f3;

          border-radius: 25px;

          box-shadow:
            0 22px 60px
            rgba(26, 52, 105, 0.12);

          flex-shrink: 0;

          overflow: hidden;
        }


        /* =====================================================
           BACK BUTTON
        ===================================================== */

        .back-section {
          width: 100%;

          display: flex;

          align-items: center;

          justify-content: flex-start;

          margin-bottom: 18px;
        }

        .back-button {
          display: inline-flex;

          align-items: center;

          gap: 4px;

          padding: 4px 0;

          border: none;

          background: transparent;

          color: #173c70;

          font-family: inherit;

          font-size: 14px;

          font-weight: 650;

          cursor: pointer;

          transition: 0.2s ease;
        }

        .back-button:hover {
          color: #315de8;

          transform: translateX(-3px);
        }

        .back-arrow {
          font-size: 18px;
        }


        /* =====================================================
           HEADER
        ===================================================== */

        .upload-header {
          width: 100%;

          display: flex;

          flex-direction: column;

          align-items: center;

          text-align: center;

          margin-bottom: 24px;
        }


        /* =====================================================
           LOGO
        ===================================================== */

        .upload-logo {
          width: 64px;

          height: 64px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 17px;

          background:
            linear-gradient(
              135deg,
              #edf4ff,
              #e8edff
            );

          font-size: 31px;

          margin-bottom: 10px;

          box-shadow:
            0 8px 22px
            rgba(58, 88, 205, 0.08);
        }


        /* =====================================================
           TITLE
        ===================================================== */

        .upload-title {
          margin: 0;

          color: #071d4a;

          font-size: 30px;

          font-weight: 800;

          line-height: 1.1;

          letter-spacing: -0.5px;
        }

        .upload-subtitle {
          margin: 7px 0 0;

          color: #6079a2;

          font-size: 15px;

          font-weight: 500;

          line-height: 1.4;
        }


        /* =====================================================
           FORM
        ===================================================== */

        .upload-form {
          width: 100%;
        }


        /* =====================================================
           FORM GROUP
        ===================================================== */

        .form-group {
          width: 100%;

          margin-bottom: 17px;
        }

        .file-group {
          margin-bottom: 14px;
        }

        .form-label {
          display: block;

          width: 100%;

          margin-bottom: 7px;

          color: #173865;

          font-size: 15px;

          font-weight: 700;

          text-align: left;
        }


        /* =====================================================
           TITLE INPUT
        ===================================================== */

        .title-input {
          display: block;

          width: 100%;

          height: 51px;

          padding: 0 15px;

          border: 1.5px solid #cbd8ec;

          border-radius: 11px;

          outline: none;

          background: #ffffff;

          color: #193863;

          font-family: inherit;

          font-size: 14px;

          transition: 0.2s ease;
        }

        .title-input::placeholder {
          color: #8192ad;
        }

        .title-input:hover {
          border-color: #aabbd9;
        }

        .title-input:focus {
          border-color: #4268e8;

          box-shadow:
            0 0 0 4px
            rgba(66, 104, 232, 0.09);
        }


        /* =====================================================
           FILE AREA
        ===================================================== */

        .file-input {
          display: none;
        }

        .file-area {
          width: 100%;

          height: 94px;

          display: flex;

          align-items: center;

          gap: 14px;

          padding: 13px 15px;

          border: 2px dashed #cbd8ee;

          border-radius: 14px;

          background:
            linear-gradient(
              180deg,
              #fcfdff 0%,
              #f6f9ff 100%
            );

          cursor: pointer;

          transition: 0.2s ease;
        }

        .file-area:hover {
          border-color: #4b6fe5;

          background:
            linear-gradient(
              180deg,
              #f9fbff,
              #f0f5ff
            );

          box-shadow:
            0 7px 20px
            rgba(55, 91, 207, 0.06);
        }

        .file-area.selected {
          border-style: solid;

          border-color: #5977e7;

          background:
            linear-gradient(
              135deg,
              #f3f8ff,
              #faf7ff
            );
        }


        /* =====================================================
           FILE ICON
        ===================================================== */

        .file-icon {
          width: 50px;

          height: 50px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 13px;

          background:
            linear-gradient(
              135deg,
              #e7f0ff,
              #eee9ff
            );

          font-size: 25px;
        }


        /* =====================================================
           FILE DETAILS
        ===================================================== */

        .file-details {
          flex: 1;

          min-width: 0;

          display: flex;

          flex-direction: column;

          justify-content: center;

          gap: 4px;
        }

        .file-name {
          overflow: hidden;

          color: #173861;

          font-size: 14px;

          font-weight: 700;

          text-overflow: ellipsis;

          white-space: nowrap;
        }

        .file-info {
          color: #7a8eaf;

          font-size: 12px;

          font-weight: 500;
        }


        /* =====================================================
           BROWSE
        ===================================================== */

        .browse-button {
          flex-shrink: 0;

          padding: 10px 17px;

          border-radius: 10px;

          background:
            linear-gradient(
              135deg,
              #e9efff,
              #eeeaff
            );

          color: #3159d9;

          font-size: 13px;

          font-weight: 700;
        }


        /* =====================================================
           FILE LIMIT
        ===================================================== */

        .file-limit {
          display: block;

          width: 100%;

          margin-top: 6px;

          color: #8195b7;

          font-size: 12px;

          font-weight: 500;

          text-align: center;
        }


        /* =====================================================
           ERROR
        ===================================================== */

        .error-message {
          width: 100%;

          display: flex;

          align-items: center;

          gap: 8px;

          padding: 9px 12px;

          margin-bottom: 10px;

          border-radius: 9px;

          border: 1px solid #ffd1d1;

          background: #fff5f5;

          color: #d73737;

          font-size: 12px;

          font-weight: 600;
        }


        /* =====================================================
           SUCCESS
        ===================================================== */

        .success-message {
          width: 100%;

          display: flex;

          align-items: center;

          gap: 8px;

          padding: 9px 12px;

          margin-bottom: 10px;

          border-radius: 9px;

          border: 1px solid #c8efd9;

          background: #f0fff6;

          color: #18864b;

          font-size: 12px;

          font-weight: 600;
        }


        /* =====================================================
           UPLOAD BUTTON
        ===================================================== */

        .upload-button {
          width: 100%;

          height: 53px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 8px;

          border: none;

          border-radius: 11px;

          outline: none;

          background:
            linear-gradient(
              135deg,
              #316bf2 0%,
              #5740e9 100%
            );

          color: #ffffff;

          font-family: inherit;

          font-size: 15px;

          font-weight: 750;

          cursor: pointer;

          box-shadow:
            0 11px 24px
            rgba(61, 77, 236, 0.22);

          transition: 0.2s ease;
        }

        .upload-button:hover:not(:disabled) {
          transform: translateY(-2px);

          box-shadow:
            0 15px 28px
            rgba(61, 77, 236, 0.28);
        }

        .upload-button:disabled {
          opacity: 0.7;

          cursor: not-allowed;
        }


        /* =====================================================
           SPINNER
        ===================================================== */

        .spinner {
          width: 16px;

          height: 16px;

          border-radius: 50%;

          border: 2px solid
            rgba(255,255,255,0.4);

          border-top-color: #ffffff;

          animation:
            upload-spin 0.7s linear infinite;
        }

        @keyframes upload-spin {
          to {
            transform: rotate(360deg);
          }
        }


        /* =====================================================
           SECURITY NOTE
        ===================================================== */

        .security-note {
          width: 100%;

          display: flex;

          align-items: center;

          gap: 10px;

          margin-top: 13px;

          padding: 9px 12px;

          border: 1px solid #e1e9f7;

          border-radius: 11px;

          background:
            linear-gradient(
              135deg,
              #f8faff,
              #fbfaff
            );
        }

        .security-icon {
          width: 34px;

          height: 34px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 9px;

          background:
            rgba(30, 112, 230, 0.10);

          font-size: 17px;
        }

        .security-title {
          display: block;

          margin-bottom: 1px;

          color: #183665;

          font-size: 11px;

          font-weight: 750;
        }

        .security-text {
          margin: 0;

          color: #7185a6;

          font-size: 10px;

          line-height: 1.3;
        }


        /* =====================================================
           SMALL HEIGHT SCREENS
        ===================================================== */

        @media (max-height: 750px) {

          .upload-page {
            padding: 10px 20px;
          }

          .upload-card {
            padding: 18px 45px 16px;

            border-radius: 22px;
          }

          .back-section {
            margin-bottom: 10px;
          }

          .upload-header {
            margin-bottom: 16px;
          }

          .upload-logo {
            width: 52px;
            height: 52px;

            font-size: 26px;

            margin-bottom: 6px;
          }

          .upload-title {
            font-size: 27px;
          }

          .upload-subtitle {
            font-size: 13px;
            margin-top: 4px;
          }

          .form-group {
            margin-bottom: 12px;
          }

          .title-input {
            height: 46px;
          }

          .file-area {
            height: 80px;
          }

          .file-icon {
            width: 43px;
            height: 43px;
          }

          .upload-button {
            height: 48px;
          }

          .security-note {
            margin-top: 9px;
            padding: 7px 10px;
          }

          .security-icon {
            width: 29px;
            height: 29px;
          }
        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 600px) {

          .upload-page {
            padding: 10px;
          }

          .upload-card {
            width: 100%;

            max-width: 100%;

            max-height: calc(100vh - 20px);

            padding: 22px 18px 18px;

            border-radius: 20px;
          }

          .upload-title {
            font-size: 27px;
          }

          .upload-subtitle {
            font-size: 13px;
          }

          .file-area {
            height: 92px;
          }

          .browse-button {
            padding: 9px 13px;
          }

        }


        /* =====================================================
           VERY SMALL MOBILE
        ===================================================== */

        @media (max-width: 400px) {

          .upload-card {
            padding:
              18px 14px 15px;
          }

          .upload-title {
            font-size: 24px;
          }

          .upload-subtitle {
            font-size: 12px;
          }

          .file-area {
            gap: 9px;
            padding: 10px;
          }

          .browse-button {
            padding: 8px 10px;
            font-size: 12px;
          }

        }

      `}</style>

    </div>
  );
};

export default Upload;