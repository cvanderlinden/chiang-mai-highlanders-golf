// app/api/users/pending/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

export async function GET() {
    try {
        await connectToDatabase();

        const pendingUsers = await User.find({ status: 'pending' });
        return NextResponse.json({ users: pendingUsers });
    } catch (error) {
        console.error('Error fetching pending users:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
