
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthCtx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login(formData);
      const data = response.data || response;

      const token = data.token;
      const user = data.user;

      if (!token || !user) {
        throw new Error("Invalid login response from server");
      }

      loginUser(token, user);
      navigate("/profile");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>UniPortal</div>

        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to your student account</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              style={styles.input}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}


const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "75vh",
    padding: "30px 15px",
    backgroundColor: "#F9F3EB",
    borderRadius: "14px",
  },

  card: {
    width: "100%",
    maxWidth: "430px",
    backgroundColor: "#FFFFFF",
    padding: "35px",
    borderRadius: "14px",
    border: "1px solid #C6D6EC",
    boxShadow: "0 8px 25px rgba(26,62,108,0.08)",
    boxSizing: "border-box",
  },

  logo: {
    color: "#1A3E6C",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
  },

  title: {
    textAlign: "center",
    color: "#1A3E6C",
    marginBottom: "8px",
  },

  subtitle: {
    textAlign: "center",
    color: "#3D6DA3",
    marginBottom: "28px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  label: {
    display: "block",
    color: "#1A3E6C",
    fontWeight: "600",
    marginBottom: "7px",
  },

  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #C6D6EC",
    borderRadius: "7px",
    fontSize: "15px",
    boxSizing: "border-box",
    backgroundColor: "#F9F3EB",
    color: "#1A3E6C",
  },

  button: {
    backgroundColor: "#1A3E6C",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "7px",
    padding: "13px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  error: {
    color: "#dc2626",
    fontSize: "14px",
    margin: 0,
  },

  footer: {
    textAlign: "center",
    marginTop: "22px",
    color: "#3D6DA3",
  },
};
