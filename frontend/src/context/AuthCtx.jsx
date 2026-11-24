import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // عند فتح التطبيق أو عمل Refresh: نفحص وجود التوكن في localStorage ونتحقق من صلاحيته
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authService.getProfile();
  const data = res.data || res;
  setUser(data.user || data.data?.user || data);
      } catch (error) {
        // إذا كان التوكن منتهي الصلاحية أو غير صالح نمسحه فوراً
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  // دالة حفظ الجلسة عند نجاح Login أو Register
  const loginUser = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  // دالة إنهاء الجلسة (Client-Side Logout)
  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, setUser, loading, loginUser, logoutUser }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
