import mongoose, { ConnectOptions } from 'mongoose';

// Ensure MONGODB_URI is defined as a string, else throw an error
const MONGODB_URI: string = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in .env');
}

// Declare a global object to manage the cached connection
declare global {
    // Avoid naming collision, use a unique identifier
    var _mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

let cached = global._mongooseCache;

if (!cached) {
    cached = global._mongooseCache = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts: ConnectOptions = {
            bufferCommands: false,
        };

        // Set up a promise that resolves once mongoose connects successfully
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
            return mongooseInstance;
        }).catch((error) => {
            console.error("Failed to connect to MongoDB:", error);
            throw error;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.conn = null; // Reset cached connection on error
        throw error;
    }

    return cached.conn;
}

export default dbConnect;