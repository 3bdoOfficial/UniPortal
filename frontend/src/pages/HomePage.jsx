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
    <section>
      <h1>CS309 Full-Stack Project Starter</h1>
      <p style={{ margin: "1rem 0", fontWeight: "600", color: "#047857" }}>
        Status: {serverStatus}
      </p>
      <p>
        <Link to="/register">Open Student Registration System →</Link>
      </p>
    </section>
  );
}
