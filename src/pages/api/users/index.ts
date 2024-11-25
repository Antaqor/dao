import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    // Connect to the database
    await dbConnect();

    switch (method) {
        case 'GET':
            try {
                // Retrieve all users
                const users = await User.find({});
                res.status(200).json({ success: true, data: users });
            } catch (error) {
                // Log the error for debugging purposes
                console.error('Error retrieving users:', error);
                res.status(400).json({ success: false, message: 'Failed to retrieve users' });
            }
            break;

        case 'POST':
            try {
                // Create a new user
                const user = await User.create(req.body);
                res.status(201).json({ success: true, data: user });
            } catch (error) {
                // Log the error for debugging purposes
                console.error('Error creating user:', error);
                res.status(400).json({ success: false, message: 'Failed to create user' });
            }
            break;

        default:
            // Handle unsupported HTTP methods
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}