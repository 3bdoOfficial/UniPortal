import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section>
      <h1>404 - Page Not Found</h1>
      <p style={{ margin: "1rem 0" }}>The page you requested does not exist.</p>
      <Link to="/">Return to Home Page</Link>
    </section>
  );
}
