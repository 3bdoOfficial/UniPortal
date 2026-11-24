import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { CLIENT_URL, NODE_ENV } from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";
import studentRoutes from "./routes/student.routes.js";
import notFound from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

// 1. ترويسات الحماية الأمنية
app.use(helmet());

// 2. السماح للواجهة الأمامية (سواء على المنفذ 3000 أو 5173) بالتخاطب مع السيرفر
app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:3000", "http://localhost:5173"],
  }),
);

// 3. تحليل JSON Body القادم في الطلبات ووضعه في req.body
app.use(express.json());

// 4. طباعة سجل الطلبات في الـ Terminal أثناء التطوير
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 5. تركيب مسارات الـ API (وهنا سنركب مسار /api/auth في الملف الثالث!)
app.use("/api/health", healthRoutes);
app.use("/api/students", studentRoutes);

// 6. التقاط المسارات غير الموجودة (404) ومعالج الأخطاء المركزي
app.use(notFound);
app.use(errorHandler);

export default app;
