import type { NextApiRequest, NextApiResponse } from 'next'; // Import types for req and res
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Establish a connection to the database
        await dbConnect();

        switch (req.method) {
            case 'GET':
                return await handleGetRequest(req, res);

            case 'POST':
                return await handlePostRequest(req, res);

            default:
                res.setHeader('Allow', ['GET', 'POST']);
                return res.status(405).json({
                    success: false,
                    message: `Method ${req.method} Not Allowed`,
                });
        }
    } catch (error) {
        console.error('Database or server error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.',
        });
    }
}

// Function to handle GET requests
async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
    try {
        const users = await User.find({});
        return res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch users. Please try again later.',
        });
    }
}

// Function to handle POST requests (Optional for creating users)
async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { username, email, phoneNumber, password } = req.body;

        // Validate the input
        if (!username || !email || !phoneNumber || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields (username, email, phoneNumber, password) are required.',
            });
        }

        // Check for duplicate users
        const existingUser = await User.findOne({
            $or: [{ username }, { email }, { phoneNumber }],
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with the given username, email, or phone number already exists.',
            });
        }

        // Create and save the new user
        const newUser = new User({
            username,
            email,
            phoneNumber,
            password, // Ensure password hashing is handled in the User model
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'User created successfully!',
            data: newUser,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create user. Please try again later.',
        });
    }
}