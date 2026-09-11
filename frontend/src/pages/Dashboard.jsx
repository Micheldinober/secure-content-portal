import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_URL = "http://localhost:5000";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // =====================================================
  // LOAD USER + CONTENT
  // =====================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const userResponse = await fetch(
        `${API_URL}/api/auth/me`,
        {
          credentials: "include",
        }
      );

      if (!userResponse.ok) {
        navigate("/login");
        return;
      }

      const userData = await userResponse.json();

      if (!userData.authenticated) {
        navigate("/login");
        return;
      }

      setUser(userData.user);

      const contentResponse = await fetch(
        `${API_URL}/api/content`,
        {
          credentials: "include",
        }
      );

      if (!contentResponse.ok) {
        throw new Error("Failed to load content");
      }

      const contentData = await contentResponse.json();

      setContents(contentData.contents || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    window.location.href = `${API_URL}/api/auth/logout`;
  };

  // =====================================================
  // DOWNLOAD
  // =====================================================

  const handleDownload = (id) => {
    window.open(
      `${API_URL}/api/content/${id}/download`,
      "_blank"
    );
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this content?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/content/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete content"
        );
      }

      setContents((previous) =>
        previous.filter((item) => item._id !== id)
      );

      setMessage("Content deleted successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to delete content."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // FORMAT FILE SIZE
  // =====================================================

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalContent = contents.length;

  const videos = contents.filter(
    (item) =>
      item.fileType?.startsWith("video/")
  ).length;

  const documents = contents.filter(
    (item) =>
      item.fileType === "application/pdf"
  ).length;

  const protectedCount = contents.filter(
    (item) => item.isProtected
  ).length;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your secure workspace...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        {/* LOGO */}

        <div className="sidebar-logo">

          <div className="logo-icon">
            🔐
          </div>

          <div className="logo-text">
            <h1>Secure</h1>
            <span>CONTENT PORTAL</span>
          </div>

        </div>

        <div className="sidebar-divider"></div>

        {/* NAVIGATION */}

        <nav className="sidebar-navigation">

          <button
            className="sidebar-item active"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <span className="sidebar-icon">
              🏠
            </span>

            <span>
              Dashboard
            </span>
          </button>


          {user?.role === "admin" && (
            <button
              className="sidebar-item"
              onClick={() =>
                navigate("/upload")
              }
            >
              <span className="sidebar-icon">
                ⬆️
              </span>

              <span>
                Upload Content
              </span>
            </button>
          )}


          {user?.role === "admin" && (
            <button
              className="sidebar-item"
              onClick={() =>
                navigate("/users")
              }
            >
              <span className="sidebar-icon">
                👥
              </span>

              <span>
                Users
              </span>
            </button>
          )}


          <button
            className="sidebar-item"
            onClick={() =>
              navigate("/profile")
            }
          >
            <span className="sidebar-icon">
              👤
            </span>

            <span>
              Profile
            </span>
          </button>

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <div className="protected-card">

            <div className="protected-icon">
              🛡️
            </div>

            <div>
              <strong>
                Protected
              </strong>

              <span>
                Your data is secure
              </span>
            </div>

          </div>


          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main-content">

        {/* TOP BAR */}

        <header className="top-bar">

          <div className="breadcrumb">

            <span>
              Secure Portal
            </span>

            <b>
              /
            </b>

            <strong>
              Dashboard
            </strong>

          </div>


          <button
            className="profile-summary"
            onClick={() =>
              navigate("/profile")
            }
          >

            <div className="profile-image-wrapper">

              {user?.profilePicture ? (

                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="profile-image"
                />

              ) : (

                <div className="profile-placeholder">
                  {user?.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

              )}

            </div>


            <div className="profile-summary-text">

              <strong>
                {user?.name || "User"}
              </strong>

              <span>
                {user?.role === "admin"
                  ? "Administrator"
                  : "Viewer"}
              </span>

            </div>


            <span className="profile-arrow">
              ›
            </span>

          </button>

        </header>


        {/* =================================================
            WELCOME HERO
        ================================================= */}

        <section className="hero-section">

          <div className="hero-decoration hero-circle-one"></div>

          <div className="hero-decoration hero-circle-two"></div>

          <div className="hero-decoration hero-circle-three"></div>


          <div className="hero-content">

            <div className="workspace-label">

              <span>
                ✨
              </span>

              SECURE WORKSPACE

            </div>


            <h2>

              Welcome back,{" "}

              <span>
                {user?.name || "User"}
              </span>

              <span className="wave">
                👋
              </span>

            </h2>


            <p>

              Manage and securely access your protected

              <br />

              content from one beautiful workspace.

            </p>

          </div>


          <div className="hero-lock">
            🔐
          </div>

        </section>


        {/* =================================================
            MESSAGES
        ================================================= */}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="stats-grid">

          {/* TOTAL CONTENT */}

          <div className="stat-card">

            <div className="stat-icon blue">
              📁
            </div>

            <div className="stat-content">

              <span className="stat-label">
                TOTAL CONTENT
              </span>

              <strong>
                {totalContent}
              </strong>

              <small>
                All uploaded files
              </small>

            </div>

          </div>


          {/* VIDEOS */}

          <div className="stat-card">

            <div className="stat-icon purple">
              🎬
            </div>

            <div className="stat-content">

              <span className="stat-label">
                VIDEOS
              </span>

              <strong>
                {videos}
              </strong>

              <small>
                Video content
              </small>

            </div>

          </div>


          {/* DOCUMENTS */}

          <div className="stat-card">

            <div className="stat-icon orange">
              📄
            </div>

            <div className="stat-content">

              <span className="stat-label">
                DOCUMENTS
              </span>

              <strong>
                {documents}
              </strong>

              <small>
                PDF documents
              </small>

            </div>

          </div>


          {/* PROTECTED */}

          <div className="stat-card">

            <div className="stat-icon green">
              🛡️
            </div>

            <div className="stat-content">

              <span className="stat-label">
                PROTECTED
              </span>

              <strong>
                {protectedCount}
              </strong>

              <small>
                Secured content
              </small>

            </div>

          </div>

        </section>


        {/* =================================================
            RECENT CONTENT
        ================================================= */}

        <section className="recent-content">

          <div className="recent-header">

            <div className="recent-title">

              <div className="recent-icon">
                📖
              </div>

              <div>

                <h3>
                  Recent Content
                </h3>

                <p>
                  Your latest protected files
                </p>

              </div>

            </div>


            {user?.role === "admin" && (

              <button
                className="upload-small-button"
                onClick={() =>
                  navigate("/upload")
                }
              >

                <span>
                  ＋
                </span>

                Upload Content

              </button>

            )}

          </div>


          <div className="content-list">

            {contents.length === 0 ? (

              <div className="empty-content">

                <div>
                  📂
                </div>

                <h3>
                  No content yet
                </h3>

                <p>
                  Upload your first protected document.
                </p>

              </div>

            ) : (

              contents
                .slice(0, 5)
                .map((item) => (

                  <div
                    className="content-row"
                    key={item._id}
                  >

                    <div className="file-type-icon">

                      {item.fileType ===
                      "application/pdf"
                        ? "PDF"
                        : "▶"}

                    </div>


                    <div className="file-information">

                      <strong>
                        {item.title}
                      </strong>

                      <span>
                        {item.originalName}
                      </span>

                    </div>


                    <div className="file-size">

                      <span>
                        📄
                      </span>

                      {formatFileSize(
                        item.fileSize
                      )}

                    </div>


                    <div className="file-date">

                      {formatDate(
                        item.createdAt
                      )}

                    </div>


                    <div className="file-actions">

                      <button
                        className="download-button"
                        onClick={() =>
                          handleDownload(
                            item._id
                          )
                        }
                      >

                        ↓

                        <span>
                          Download
                        </span>

                      </button>


                      {user?.role === "admin" && (

                        <button
                          className="delete-button"
                          disabled={
                            deletingId ===
                            item._id
                          }
                          onClick={() =>
                            handleDelete(
                              item._id
                            )
                          }
                        >

                          🗑

                          <span>
                            {deletingId === item._id
                              ? "Deleting..."
                              : "Delete"}
                          </span>

                        </button>

                      )}

                    </div>

                  </div>

                ))

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;