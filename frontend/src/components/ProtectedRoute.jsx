import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthCtx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <p style={{ padding: "2rem", fontWeight: "600" }}>
        Loading user session...
      </p>
    );
  }

  // خاصية replace تستبدل سجل التاريخ في المتصفح حتى لا يعلق زر الرجوع للخلف (Back Button) في حلقة مفرغة!
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
