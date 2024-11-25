import mongoose from 'mongoose';

declare global {
    // Allow global `mongoose` to store a cached connection
    var mongoose: {
        conn: mongoose.Connection | null;
        promise: Promise<mongoose.Connection> | null;
    };
}
