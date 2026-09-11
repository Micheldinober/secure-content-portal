import "./Login.css";

function Login() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-box">🔐</div>

        <h1>Secure Content Portal</h1>

        <p className="login-subtitle">
          Securely access your protected content
        </p>

        <div className="login-info">
          <h2>Welcome Back</h2>
          <p>Sign in with your Google account to continue.</p>
        </div>

        <button
          className="google-login-btn"
          onClick={handleGoogleLogin}
        >
          <span className="google-icon">G</span>
          Continue with Google
        </button>

        <p className="security-text">
          🔒 Your account and content are securely protected
        </p>
      </div>
    </div>
  );
}

export default Login;