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

  // Get first letter of user's name
  const getInitial = () => {
    if (!user?.name) {
      return "U";
    }

    return user.name.charAt(0).toUpperCase();
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

  const isAdmin =
    user.role?.toLowerCase() === "admin";

  const initial = getInitial();

  return (
    <div className="profile-layout">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="profile-sidebar">

        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            🔐
          </div>

          <span>
            Secure Portal
          </span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-navigation">

          {/* Dashboard */}
          <button
            type="button"
            className="sidebar-link"
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

          {/* Upload Content - Admin only */}
          {isAdmin && (
            <button
              type="button"
              className="sidebar-link"
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

          {/* Users - Admin only */}
          {isAdmin && (
            <button
              type="button"
              className="sidebar-link"
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

          {/* Profile */}
          <button
            type="button"
            className="sidebar-link active"
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

          {/* Logout */}
          <button
            type="button"
            className="sidebar-link logout-link"
            onClick={handleLogout}
          >
            <span className="sidebar-icon">
              🚪
            </span>

            <span>
              Logout
            </span>
          </button>

        </nav>
      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="profile-main">

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="profile-page-header">

          <div className="page-heading">

            <h1>
              My Profile
            </h1>

            <p>
              Manage and view your account information.
            </p>

          </div>


          {/* Header User */}
          <div className="header-user">

            {/* FIRST LETTER ONLY */}
            <div className="header-profile-placeholder">
              {initial}
            </div>

            <div className="header-user-info">

              <strong>
                {user.name}
              </strong>

              <span>
                {isAdmin
                  ? "Administrator"
                  : "Viewer"}
              </span>

            </div>

          </div>

        </header>


        {/* ===================================================
            PROFILE CARD
        =================================================== */}

        <section className="profile-card">

          {/* Identity */}
          <div className="profile-identity">

            {/* FIRST LETTER ONLY */}
            <div className="profile-picture-wrapper">

              <div className="profile-picture-placeholder">
                {initial}
              </div>

              <div className="online-indicator"></div>

            </div>


            <div className="profile-identity-info">

              <h2>
                {user.name}
              </h2>

              <span
                className={`role-badge ${
                  isAdmin
                    ? "admin-role"
                    : "viewer-role"
                }`}
              >
                {isAdmin
                  ? "Administrator"
                  : "Viewer"}
              </span>

            </div>

          </div>


          {/* Divider */}
          <div className="profile-divider"></div>


          {/* Information Grid */}
          <div className="profile-info-grid">

            {/* Full Name */}
            <div className="profile-info-card">

              <div className="info-icon">
                👤
              </div>

              <div className="info-content">

                <span className="info-label">
                  FULL NAME
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
                  EMAIL ADDRESS
                </span>

                <strong className="email-value">
                  {user.email}
                </strong>

              </div>

            </div>


            {/* Role */}
            <div className="profile-info-card">

              <div className="info-icon">
                🛡️
              </div>

              <div className="info-content">

                <span className="info-label">
                  ACCOUNT ROLE
                </span>

                <strong>
                  {isAdmin
                    ? "Administrator"
                    : "Viewer"}
                </strong>

              </div>

            </div>


            {/* Status */}
            <div className="profile-info-card">

              <div className="info-icon status-icon">
                ✓
              </div>

              <div className="info-content">

                <span className="info-label">
                  ACCOUNT STATUS
                </span>

                <strong className="active-status">

                  <span className="status-dot"></span>

                  Active

                </strong>

              </div>

            </div>

          </div>


          {/* Footer */}
          <div className="profile-card-footer">

            <button
              type="button"
              className="back-dashboard-button"
              onClick={() =>
                navigate("/dashboard")
              }
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