import { NODE_ENV } from "../config/env.js";

const errorHandler = (err, req, res, next) => {
  let statusCode =
    err.statusCode ||
    err.status ||
    (res.statusCode >= 400 ? res.statusCode : 500);
  let message = err.message || "Internal Server Error";

  // 1. التقاط خطأ تكرار قيمة فريدة في MongoDB (مثل تكرار الإيميل) وإرجاع 409 Conflict
  if (err.code === 11000) {
    statusCode = 409;
    const duplicateField = Object.keys(err.keyValue || {})[0] || "Field";
    message =
      duplicateField === "email"
        ? "Email already exists"
        : `${duplicateField} already exists`;
  }

  // 2. التقاط خطأ التحقق من الحقول المطلوبة في Mongoose وإرجاع 400 Bad Request
  if (err.name === "ValidationError") {
    statusCode = 400;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
