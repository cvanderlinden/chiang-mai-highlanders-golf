// /api/courses/create/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Course from '@/models/Course';

export async function POST(request: Request) {
    try {
        const { name, slopeRating, courseRating, par, mapLink } = await request.json();

        await connectToDatabase();

        const newCourse = new Course({
            name,
            slopeRating,
            courseRating,
            par,
            mapLink,
            status: 'active',
        });

        await newCourse.save();

        return NextResponse.json({ message: 'Course created successfully', course: newCourse }, { status: 201 });
    } catch (error) {
        console.error('Error creating course:', error);

        // Safely handle error type
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json({ message: 'Error creating course', error: errorMessage }, { status: 500 });
    }
}
