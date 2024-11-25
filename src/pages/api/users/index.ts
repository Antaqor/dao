// File: /src/pages/api/users/index.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case 'GET':
            try {
                const users = await User.find({});
                res.status(200).json({ success: true, data: users });
            } catch (error) {
                res.status(400).json({ success: false, message: "Failed to retrieve users" });
            }
            break;

        case 'POST':
            try {
                const user = await User.create(req.body);
                res.status(201).json({ success: true, data: user });
            } catch (error) {
                res.status(400).json({ success: false, message: "Failed to create user" });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}
