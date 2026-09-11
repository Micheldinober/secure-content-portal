import React from "react";
import { useNavigate } from "react-router-dom";
import "./Users.css";

const users = [
  {
    name: "Marshall A",
    email: "marshalldassofficial@gmail.com",
    role: "Viewer",
    initial: "M",
    avatarClass: "purple",
  },
  {
    name: "Michel Dinober",
    email: "micheldinober33@gmail.com",
    role: "Admin",
    initial: "M",
    avatarClass: "blue",
  },
  {
    name: "michel dinober",
    email: "dinober2005@gmail.com",
    role: "Viewer",
    initial: "m",
    avatarClass: "brown",
  },
];

function Users() {
  const navigate = useNavigate();

  /* =====================================================
     NAVIGATION EVENTS
     ===================================================== */

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleUpload = () => {
    navigate("/upload");
  };

  const handleUsers = () => {
    navigate("/users");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    // Clear login information if your app uses localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const handleProfileSummary = () => {
    navigate("/profile");
  };

  const handleRoleChange = (event, user) => {
    const newRole = event.target.value;

    console.log(
      `Role changed for ${user.name}: ${user.role} → ${newRole}`
    );

    /*
      If you have an API/backend for changing roles,
      put your API call here.

      Example:

      await updateUserRole(user.email, newRole);
    */
  };

  return (
    <div className="users-page">

      {/* =================================================
          SIDEBAR
          ================================================= */}

      <aside className="sidebar">

        {/* LOGO */}
        <div className="sidebar-logo">
          <div className="logo-icon">🔐</div>

          <div className="logo-text">
            <h1>Secure</h1>
            <span>CONTENT PORTAL</span>
          </div>
        </div>

        <div className="sidebar-divider"></div>

        {/* NAVIGATION */}
        <nav className="sidebar-navigation">

          <button
            type="button"
            className="sidebar-item"
            onClick={handleDashboard}
          >
            <span className="sidebar-icon">🏠</span>
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className="sidebar-item"
            onClick={handleUpload}
          >
            <span className="sidebar-icon">⬆️</span>
            <span>Upload Content</span>
          </button>

          <button
            type="button"
            className="sidebar-item active"
            onClick={handleUsers}
          >
            <span className="sidebar-icon">👥</span>
            <span>Users</span>
          </button>

          <button
            type="button"
            className="sidebar-item"
            onClick={handleProfile}
          >
            <span className="sidebar-icon">👤</span>
            <span>Profile</span>
          </button>

        </nav>

        {/* SIDEBAR BOTTOM */}
        <div className="sidebar-bottom">

          {/* PROTECTED */}
          <div className="protected-card">
            <div className="protected-icon">
              🛡️
            </div>

            <div className="protected-text">
              <strong>Protected</strong>
              <span>Your data is secure</span>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            <span className="logout-icon">↪</span>
            <span>Logout</span>
          </button>

        </div>
      </aside>


      {/* =================================================
          MAIN CONTENT
          ================================================= */}

      <main className="main-content">

        {/* =================================================
            TOP SECTION
            ================================================= */}

        <div className="top-section">

          {/* BREADCRUMB */}
          <div className="breadcrumb">
            <span className="breadcrumb-light">
              Secure Portal
            </span>

            <span className="breadcrumb-slash">
              /
            </span>

            <strong>
              Users
            </strong>
          </div>


          {/* PROFILE SUMMARY */}
          <button
            type="button"
            className="profile-summary"
            onClick={handleProfileSummary}
            aria-label="Open profile"
          >
            <div className="profile-avatar">
              M
            </div>

            <div className="profile-details">
              <strong>
                Michel Dinober
              </strong>

              <span>
                Administrator
              </span>
            </div>

            <span className="profile-arrow">
              ›
            </span>
          </button>

        </div>


        {/* =================================================
            PAGE HEADING
            ================================================= */}

        <section className="page-heading">

          <h1>
            User Management
          </h1>

          <p>
            Manage users and their access roles
          </p>

        </section>


        {/* =================================================
            REGISTERED USERS
            ================================================= */}

        <section className="users-card">

          {/* CARD HEADER */}
          <div className="users-card-header">

            <div className="users-card-title">

              <div className="users-card-icon">
                👥
              </div>

              <div>
                <h2>
                  Registered Users
                </h2>

                <p>
                  View and manage user access permissions.
                </p>
              </div>

            </div>


            <div className="users-count">
              3 Users
            </div>

          </div>


          {/* =================================================
              USERS TABLE
              ================================================= */}

          <div className="users-table">

            {/* TABLE HEADER */}
            <div className="users-table-header">

              <div>
                User
              </div>

              <div>
                Email
              </div>

              <div>
                Role
              </div>

              <div>
                Account
              </div>

              <div>
                Action
              </div>

            </div>


            {/* USER ROWS */}
            {users.map((user, index) => (

              <div
                className="user-row"
                key={index}
              >

                {/* USER */}
                <div className="user-info">

                  <div
                    className={`user-avatar ${user.avatarClass}`}
                  >
                    {user.initial}
                  </div>

                  <div className="user-name">
                    {user.name}
                  </div>

                </div>


                {/* EMAIL */}
                <div className="user-email">
                  {user.email}
                </div>


                {/* ROLE */}
                <div>

                  <span
                    className={`role-badge ${
                      user.role === "Admin"
                        ? "role-admin"
                        : "role-viewer"
                    }`}
                  >

                    <span>
                      {user.role === "Admin"
                        ? "🛡️"
                        : "👤"}
                    </span>

                    {user.role}

                  </span>

                </div>


                {/* ACCOUNT */}
                <div>

                  <span className="status-badge">

                    <span className="status-dot"></span>

                    Active

                  </span>

                </div>


                {/* ACTION */}
                <div>

                  <select
                    className="role-select"
                    defaultValue={user.role}
                    onChange={(event) =>
                      handleRoleChange(event, user)
                    }
                  >

                    <option value="Viewer">
                      Viewer
                    </option>

                    <option value="Admin">
                      Admin
                    </option>

                  </select>

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* =================================================
            ACCESS CONTROL
            ================================================= */}

        <section className="access-control">

          <div className="access-icon">
            🔐
          </div>

          <div className="access-content">

            <h3>
              Access Control
            </h3>

            <p>
              Admin users can upload, delete, and manage
              protected content. Viewer users can only view
              and download available content.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Users;