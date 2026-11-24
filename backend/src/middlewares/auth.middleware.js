import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../config/env.js";

// 1. Authentication Middleware (protect): يتحقق من هوية المستخدم عبر الـ JWT Token
export const protect = async (req, res, next) => {
  try {
    let token;

    // فحص وجود هيدر Authorization وأنه يبدأ بكلمة Bearer متبوعة بمسافة
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route (No token provided)",
      });
    }

    // التحقق الرياضي من صحة التوقيع الرقمي للتوكن وعدم انتهاء صلاحيته
    const decoded = jwt.verify(token, JWT_SECRET);

    // جلب المستخدم من الداتابيز للتأكد من أن حسابه ما زال موجوداً ولم يُحذف
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "The user belonging to this token no longer exists",
      });
    }

    // حقن بيانات المستخدم داخل كائن الطلب req.user ليجدها الـ Controller جاهزة فوراً!
    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// 2. Authorization Middleware (authorize): يتحقق من صلاحيات ورتبة المستخدم (Role-Based Access Control)
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user?.role}) is not authorized to perform this action`,
      });
    }
    next();
  };
};
