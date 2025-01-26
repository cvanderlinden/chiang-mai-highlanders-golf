// app/api/tee-offs/create/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import TeeOff from '@/models/TeeOff';
import Course from '@/models/Course';
import User from '@/models/User';

export async function POST(request: Request) {
    try {
        const { course: courseId, date, time, createdBy, golfers } = await request.json();

        await connectToDatabase();

        // Validate course
        const course = await Course.findById(courseId);
        if (!course) {
            return NextResponse.json({ message: 'Course not found' }, { status: 404 });
        }

        // Validate creator
        const creator = await User.findById(createdBy);
        if (!creator) {
            return NextResponse.json({ message: 'Creator not found' }, { status: 404 });
        }

        // Validate golfers
        const validatedGolfers = [];
        for (const golfer of golfers) {
            const user = await User.findById(golfer.userId);
            if (!user) {
                return NextResponse.json({ message: `Golfer with ID ${golfer.userId} not found` }, { status: 404 });
            }
            validatedGolfers.push({ userId: user._id, name: `${user.firstName} ${user.lastName}` });
        }

        // Create the tee-off
        const newTeeOff = new TeeOff({
            courseId: course._id,
            courseName: course.name, // Store the course name
            date,
            time,
            golfers: validatedGolfers,
            createdBy: creator._id,
        });

        await newTeeOff.save();

        return NextResponse.json(
            { message: 'Tee-off time added successfully.', teeOff: newTeeOff },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating tee-off time:', error);
        return NextResponse.json({ message: 'Error creating tee-off time', error: error.message }, { status: 500 });
    }
}
