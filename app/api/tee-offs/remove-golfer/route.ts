// app/api/tee-offs/remove-golfer/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import TeeOff from '@/models/TeeOff';

export async function POST(request: Request) {
    const { teeOffId, userId } = await request.json();

    await connectToDatabase();

    try {
        const teeOff = await TeeOff.findById(teeOffId);
        if (!teeOff) {
            return NextResponse.json({ message: 'Tee-off not found' }, { status: 404 });
        }

        // Adjust findIndex to compare `userId._id` with `userId`
        const golferIndex = teeOff.golfers.findIndex(
            (g) => g.userId.toString() === userId // Ensure proper comparison
        );

        if (golferIndex === -1) {
            return NextResponse.json({ message: 'Golfer not found in this tee-off' }, { status: 400 });
        }

        // Remove the golfer from the array
        teeOff.golfers.splice(golferIndex, 1);

        // If no golfers remain, update the status to 'cancelled'
        if (teeOff.golfers.length === 0) {
            teeOff.status = 'cancelled';
        }

        await teeOff.save();

        return NextResponse.json({
            message: 'Golfer removed successfully',
            golfers: teeOff.golfers,
        }, { status: 200 });
    } catch (error) {
        console.error('Error removing golfer:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json({ message: 'Error fetching courses', error: errorMessage }, { status: 500 });
    }
}
