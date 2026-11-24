import axios from "axios";

const BASE_URL =
  (typeof process !== "undefined" && process.env?.REACT_APP_API_BASE_URL) ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: يرفق الـ JWT Token تلقائياً مع كل طلب يخرج من React
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
