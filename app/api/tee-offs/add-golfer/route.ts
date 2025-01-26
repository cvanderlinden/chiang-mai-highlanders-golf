// /api/tee-offs/add-golfer/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import TeeOff from '@/models/TeeOff';

export async function POST(request: Request) {
    const { teeOffId, golfer } = await request.json();

    await connectToDatabase();

    try {
        // Check if the golfer is already in the tee-off
        const teeOff = await TeeOff.findById(teeOffId);
        if (!teeOff) {
            return NextResponse.json({ message: 'Tee-off not found' }, { status: 404 });
        }

        const isGolferAlreadyAdded = teeOff.golfers.some((g) => g.userId === golfer.userId);
        if (isGolferAlreadyAdded) {
            return NextResponse.json({ message: 'Golfer already added to this tee-off' }, { status: 400 });
        }

        // Add the golfer to the tee-off
        teeOff.golfers.push(golfer);
        await teeOff.save();

        return NextResponse.json({
            message: 'Golfer added successfully',
            golfers: teeOff.golfers
        }, { status: 200 });
    } catch (error) {
        console.error('Error adding golfer:', error);
        return NextResponse.json({ message: 'Failed to add golfer', error }, { status: 500 });
    }
}
