import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    try {
        // Connect to the database
        await dbConnect();

        switch (method) {
            case 'GET':
                return handleGetRequest(req, res);

            case 'POST':
                return handlePostRequest(req, res);

            default:
                // Handle unsupported HTTP methods
                res.setHeader('Allow', ['GET', 'POST']);
                return res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
        }
    } catch (error) {
        console.error('Database connection error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
    }
}

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Retrieve all users
        const users = await User.find({});
        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error retrieving users:', error);
        return res.status(400).json({ success: false, message: 'Failed to retrieve users' });
    }
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Create a new user
        const { username, email, phoneNumber, password } = req.body;

        // Validate user input before creating a user
        if (!username || !email || !phoneNumber || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const user = await User.create({ username, email, phoneNumber, password });
        return res.status(201).json({ success: true, data: user });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error creating user:', error);
        return res.status(400).json({ success: false, message: 'Failed to create user' });
    }
}