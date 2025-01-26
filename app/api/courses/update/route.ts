// /api/courses/update/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Course from '@/models/Course';

export async function PUT(request: Request) {
    try {
        const { courseId, name, slopeRating, courseRating, par, mapLink } = await request.json();

        await connectToDatabase();

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                name,
                slopeRating,
                courseRating,
                par,
                mapLink,
                updatedAt: Date.now(),
            },
            { new: true }
        );

        return NextResponse.json({ message: 'Course updated successfully', course: updatedCourse }, { status: 200 });
    } catch (error) {
        // Ensure the error handling follows best practices
        console.error('Error updating courses:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json({ message: 'Error fetching courses', error: errorMessage }, { status: 500 });

    }
}
