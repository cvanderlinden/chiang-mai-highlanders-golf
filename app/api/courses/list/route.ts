// /api/courses/list/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Course from '@/models/Course';

export async function GET() {
    try {
        await connectToDatabase();

        const courses = await Course.find({ status: 'active' }).sort({ name: 1 }).collation({ locale: "en", strength: 2 });

        console.log('Fetched courses:', courses);

        return NextResponse.json(courses, { status: 200 });
    } catch (error) {
        // Ensure the error handling follows best practices
        console.error('Error fetching courses:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json({ message: 'Error fetching courses', error: errorMessage }, { status: 500 });

    }
}
