import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

// Cache global para evitar múltiples conexiones en hot-reload.
const globalCache = globalForMongoose.mongooseCache ?? { conn: null, promise: null };

globalForMongoose.mongooseCache = globalCache;

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI ?? "";
  if (!mongoUri) {
    throw new Error("MONGODB_URI no está definida en las variables de entorno.");
  }

  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(mongoUri, {
      dbName: "supermercado_el_negro"
    });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}
