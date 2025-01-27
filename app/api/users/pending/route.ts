// app/api/users/pending/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDatabase();

        const pendingUsers = await User.find({ status: 'pending' });
        const response = NextResponse.json({ users: pendingUsers });
        response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
        return response;
    } catch (error) {
        console.error('Error fetching pending users:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
