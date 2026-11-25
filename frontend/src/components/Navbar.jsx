import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthCtx";

export default function Navbar() {
  const { user, logoutUser } = useAuth();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        borderBottom: "1px solid #cbd5e1",
        backgroundColor: "#ffffff",
      }}
    >
      <Link
        to="/"
        style={{
          fontWeight: "800",
          fontSize: "1.2rem",
          color: "#0f172a",
          textDecoration: "none",
        }}
      >
        CS309 Full-Stack System
      </Link>

      <nav style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
        <Link
          to="/"
          style={{
            color: "#1e293b",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Home
        </Link>

        {user ? (
          <>
            <Link
              to="/profile"
              style={{
                color: "#4338ca",
                textDecoration: "none",
                fontWeight: "700",
              }}
            >
              Profile ({user.firstName})
            </Link>
            <button
              onClick={logoutUser}
              style={{
                padding: "0.35rem 0.75rem",
                backgroundColor: "#991b1b",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                color: "#4338ca",
                textDecoration: "none",
                fontWeight: "700",
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                color: "#047857",
                textDecoration: "none",
                fontWeight: "700",
              }}
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
