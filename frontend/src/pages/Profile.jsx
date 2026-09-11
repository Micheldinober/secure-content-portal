import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          navigate("/login");
          return;
        }

        const data = await response.json();

        if (!data.authenticated) {
          navigate("/login");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("Profile fetch error:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    window.location.href =
      "http://localhost:5000/api/auth/logout";
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isAdmin = user.role === "admin";

  const getInitial = () => {
    if (user.name) {
      return user.name.charAt(0).toUpperCase();
    }

    return "U";
  };

  return (
    <div className="profile-layout">

      {/* ================= SIDEBAR ================= */}
      <aside className="profile-sidebar">

        <div className="sidebar-brand">
          <div className="brand-icon">🔐</div>
          <span>Secure Portal</span>
        </div>

        <nav className="sidebar-navigation">

          {/* Dashboard */}
          <button
            className="sidebar-link"
            onClick={() => navigate("/dashboard")}
          >
            <span className="sidebar-icon">🏠</span>
            <span>Dashboard</span>
          </button>

          {/* My Content REMOVED */}

          {/* Upload Content */}
          {isAdmin && (
            <button
              className="sidebar-link"
              onClick={() => navigate("/upload")}
            >
              <span className="sidebar-icon">⬆️</span>
              <span>Upload Content</span>
            </button>
          )}

          {/* Users */}
          {isAdmin && (
            <button
              className="sidebar-link"
              onClick={() => navigate("/users")}
            >
              <span className="sidebar-icon">👥</span>
              <span>Users</span>
            </button>
          )}

          {/* Profile */}
          <button
            className="sidebar-link active"
            onClick={() => navigate("/profile")}
          >
            <span className="sidebar-icon">👤</span>
            <span>Profile</span>
          </button>

          {/* Logout */}
          <button
            className="sidebar-link logout-link"
            onClick={handleLogout}
          >
            <span className="sidebar-icon">🚪</span>
            <span>Logout</span>
          </button>

        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="profile-main">

        {/* Header */}
        <header className="profile-page-header">

          <div>
            <h1>My Profile</h1>

            <p>
              Manage and view your account information.
            </p>
          </div>

          {/* Header User */}
          <div className="header-user">

            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="header-profile-image"
              />
            ) : (
              <div className="header-profile-placeholder">
                {getInitial()}
              </div>
            )}

            <div className="header-user-info">
              <strong>{user.name}</strong>

              <span>
                {isAdmin ? "Administrator" : "Viewer"}
              </span>
            </div>

          </div>

        </header>

        {/* ================= PROFILE CARD ================= */}
        <section className="profile-card">

          {/* Profile Identity */}
          <div className="profile-identity">

            <div className="profile-picture-wrapper">

              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="profile-picture"
                />
              ) : (
                <div className="profile-picture-placeholder">
                  {getInitial()}
                </div>
              )}

              <div className="online-indicator"></div>

            </div>

            <div className="profile-identity-info">

              <h2>{user.name}</h2>

              <span
                className={`role-badge ${
                  isAdmin
                    ? "admin-role"
                    : "viewer-role"
                }`}
              >
                {isAdmin ? "Administrator" : "Viewer"}
              </span>

            </div>

          </div>

          <div className="profile-divider"></div>

          {/* ================= INFORMATION GRID ================= */}
          <div className="profile-info-grid">

            {/* Full Name */}
            <div className="profile-info-card">

              <div className="info-icon">
                👤
              </div>

              <div className="info-content">

                <span className="info-label">
                  Full Name
                </span>

                <strong>
                  {user.name}
                </strong>

              </div>

            </div>

            {/* Email */}
            <div className="profile-info-card">

              <div className="info-icon">
                📧
              </div>

              <div className="info-content">

                <span className="info-label">
                  Email Address
                </span>

                <strong className="email-value">
                  {user.email}
                </strong>

              </div>

            </div>

            {/* Account Role */}
            <div className="profile-info-card">

              <div className="info-icon">
                🛡️
              </div>

              <div className="info-content">

                <span className="info-label">
                  Account Role
                </span>

                <strong>
                  {isAdmin
                    ? "Administrator"
                    : "Viewer"}
                </strong>

              </div>

            </div>

            {/* Account Status */}
            <div className="profile-info-card">

              <div className="info-icon status-icon">
                ✓
              </div>

              <div className="info-content">

                <span className="info-label">
                  Account Status
                </span>

                <strong className="active-status">

                  <span className="status-dot"></span>

                  Active

                </strong>

              </div>

            </div>

          </div>

          {/* ================= FOOTER ================= */}
          <div className="profile-card-footer">

            <button
              className="back-dashboard-button"
              onClick={() => navigate("/dashboard")}
            >
              <span>←</span>
              Back to Dashboard
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Profile;