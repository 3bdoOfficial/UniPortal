import mongoose from "mongoose";
import { MONGODB_URI } from "./env.js";

const connectDB = async () => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in backend/.env file");
  }

  const conn = await mongoose.connect(MONGODB_URI);
  console.log("MongoDB Connected Successfully:", conn.connection.name);
};

export default connectDB;
