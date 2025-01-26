// /api/courses/list/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Course from '@/models/Course';

export async function GET() {
    try {
        await connectToDatabase();

        const courses = await Course.find({ status: 'active' }).sort({ name: 1 });

        return NextResponse.json(courses, { status: 200 });
    } catch (error) {
        console.error('Error fetching courses:', error);
        return NextResponse.json({ message: 'Error fetching courses', error: error.message }, { status: 500 });
    }
}
