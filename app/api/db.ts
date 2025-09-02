import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  console.warn("MONGODB_URI is not set. API routes depending on DB will fail.");
}

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
type GlobalWithMongoose = typeof global & { mongoose?: MongooseCache };

const g = global as unknown as GlobalWithMongoose;

let cached: MongooseCache | undefined = g.mongoose;
if (!cached) {
  cached = { conn: null, promise: null };
  g.mongoose = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached?.conn) return cached.conn;
  if (!cached?.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB || undefined,
    });
  }
  cached!.conn = await cached!.promise;
  return cached!.conn!;
}


