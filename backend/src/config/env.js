import "dotenv/config";

export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
export const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET || "cs309_dev_secret_key";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
