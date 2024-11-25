import mongoose, { ConnectOptions } from 'mongoose';

// Ensure MONGODB_URI is defined as a string, else throw an error
const MONGODB_URI: string = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in .env');
}

// Extend the global object to add the `_mongooseCache` property
declare global {
    // This allows us to add a custom property to `global`
    // Use `let` instead of `var` for better scoping
    var _mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

// Use `const` instead of `let` for non-reassigned variables
const cached = global._mongooseCache || (global._mongooseCache = { conn: null, promise: null });

async function dbConnect(): Promise<typeof mongoose> {
    // Return cached connection if available
    if (cached.conn) {
        return cached.conn;
    }

    // Initialize connection promise if not already done
    if (!cached.promise) {
        const opts: ConnectOptions = {
            bufferCommands: false,
        };

        // Establish a new connection and cache the promise
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
            console.log('Successfully connected to MongoDB!');
            return mongooseInstance;
        }).catch((error) => {
            console.error('Failed to connect to MongoDB:', error);
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