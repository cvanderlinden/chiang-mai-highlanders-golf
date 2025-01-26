// /api/courses/delete/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Course from '@/models/Course';

export async function POST(request: Request) {
    try {
        const { courseId } = await request.json();

        await connectToDatabase();

        await Course.findByIdAndDelete(courseId);

        return NextResponse.json({ message: 'Course deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting course:', error);
        return NextResponse.json({ message: 'Error deleting course', error: error.message }, { status: 500 });
    }
}
