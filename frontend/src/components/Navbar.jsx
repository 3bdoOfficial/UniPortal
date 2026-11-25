
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthCtx";

export default function Navbar() {
  const { user, logoutUser } = useAuth();

  const linkStyle = {
    color: "#1A3E6C",
    textDecoration: "none",
    fontWeight: "700",
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        borderBottom: "1px solid #C6D6EC",
        backgroundColor: "#ffffff",
      }}
    >
      <Link
        to="/"
        style={{
          fontWeight: "800",
          fontSize: "1.2rem",
          color: "#1A3E6C",
          textDecoration: "none",
        }}
      >
        UniPortal
      </Link>

      <nav style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
        <Link to="/" style={linkStyle}>
          Home
        </Link>

        {user ? (
          <>
            <Link to="/profile" style={linkStyle}>
              Profile ({user.firstName})
            </Link>

            <button
              onClick={logoutUser}
              style={{
                padding: "0.35rem 0.75rem",
                backgroundColor: "#1A3E6C",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>
              Login
            </Link>

            <Link to="/register" style={linkStyle}>
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
