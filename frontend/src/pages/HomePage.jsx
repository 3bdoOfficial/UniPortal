import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function HomePage() {
  const [serverStatus, setServerStatus] = useState(
    "Checking backend connection...",
  );

  useEffect(() => {
    api
      .get("/health")
      .then((res) => {
        console.log("Backend Response:", res.data);
        setServerStatus("Connected to Express & MongoDB Atlas (200 OK)");
      })
      .catch(() => {
        setServerStatus(
          "Backend connection failed - make sure server is running on port 5000",
        );
      });
  }, []);

  return (
    <section
      style={{
        backgroundColor: "#F9F3EB",
        color: "#1A3E6C",
        padding: "30px",
        borderRadius: "12px",
        minHeight: "300px",
        border: "1px solid #C6D6EC",
      }}
    >
      <h1 style={{ color: "#1A3E6C" }}>CS309 Full-Stack Project Starter</h1>

      <p
        style={{
          margin: "1rem 0",
          fontWeight: "600",
          color: "#3D6DA3",
        }}
      >
        Status: {serverStatus}
      </p>

      <p>
        <Link
          to="/register"
          style={{
            color: "#1A3E6C",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          Open Student Registration System →
        </Link>
      </p>
    </section>
  );
}
