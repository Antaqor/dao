// models/User.ts
import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    username: { // Existing fields
        type: String,
        required: true,
        unique: true,
    },
    email: { // Existing fields
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: { // Existing fields
        type: String,
        required: true,
        unique: true,
    },
    password: { // Existing fields
        type: String,
        required: true,
    },
    profilePicture: { // New Field
        type: String, // URL or file path
        default: '', // Optional: Set a default image path if desired
    },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);

export default User;