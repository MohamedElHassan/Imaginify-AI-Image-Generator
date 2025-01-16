import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;
const dbName = "saas-ai-nextjs";
interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (cached.conn && dbName !== "saas-ai-nextjs") {
    cached.conn = null;
    cached.promise = null;
  }
  

  if (!MONGODB_URL) throw new Error("Misisng MONGODB_URL");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: dbName,
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};
