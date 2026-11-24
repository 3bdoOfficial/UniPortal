import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        color: "#0f172a",
      }}
    >
      <Navbar />
      <main
        style={{ maxWidth: "860px", margin: "0 auto", padding: "2rem 1.25rem" }}
      >
        {children}
      </main>
    </div>
  );
}
