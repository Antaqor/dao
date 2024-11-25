// src/pages/api/auth/someRoute.ts
import type { NextApiRequest, NextApiResponse } from 'next'; // Import types for req and res
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();  // Connect to the database

    if (req.method === 'GET') {
        try {
            const users = await User.find({});
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}