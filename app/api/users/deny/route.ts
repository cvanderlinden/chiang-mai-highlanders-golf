// app/api/users/deny/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

export async function DELETE(request: Request) {
    const { userId } = await request.json();

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User denied and deleted successfully' });
    } catch (error) {
        console.error('Error denying user:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
