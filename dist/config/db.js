import mongoose from "mongoose";
import { env } from "./env.js";
const cached = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;
export async function connectDb(uri = env.MONGODB_URI) {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = mongoose.connect(uri, { bufferCommands: false }).then((connection) => {
            console.log("MongoDB connected");
            return connection;
        });
    }
    try {
        cached.conn = await cached.promise;
    }
    catch (error) {
        cached.promise = null;
        throw error;
    }
    return cached.conn;
}
//# sourceMappingURL=db.js.map