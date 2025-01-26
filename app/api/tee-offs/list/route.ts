// app/api/tee-offs/list/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import TeeOff from '@/models/TeeOff';
import dayjs from 'dayjs';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    await connectToDatabase();

    try {
        const today = dayjs().startOf('day').toISOString();
        const skip = (page - 1) * limit;

        // Remove past tee-offs
        await TeeOff.deleteMany({ date: { $lt: today } });

        // Fetch active and upcoming tee-offs
        const teeOffs = await TeeOff.find({ status: 'active', date: { $gte: today } })
            .sort({ date: 1, time: 1 })
            .skip(skip)
            .limit(limit)
            .populate('courseId', 'name') // Include course name
            .populate('golfers.userId', 'firstName lastName'); // Include golfer details

        const totalTeeOffs = await TeeOff.countDocuments({ status: 'active', date: { $gte: today } });

        return NextResponse.json({
            teeOffs,
            total: totalTeeOffs,
            page,
            totalPages: Math.ceil(totalTeeOffs / limit),
        }, { status: 200 });
    } catch (error) {
        console.error('Error retrieving Tee Off times:', error);
        return NextResponse.json({ message: 'Error retrieving Tee Off times', error }, { status: 500 });
    }
}
