import mongoose from "mongoose";
import app from "./app";
const JWT_SECRET = process.env.JWT_SECRET;

const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/vendrix-users";

if (!MONGODB_URI) {
  console.error("FATAL ERROR: MONGODB_URI is not defined.");
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
