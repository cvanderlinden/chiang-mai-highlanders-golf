// app/api/scores/create/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Score from '@/models/Score';
import Course from '@/models/Course';

export async function POST(request: Request) {
    try {
        const { userId, courseId, course, date, score, handicap, holes } = await request.json();

        await connectToDatabase();

        // Fetch course information
        const selectedCourse = await Course.findById(courseId);
        if (!selectedCourse) {
            return NextResponse.json({ message: 'Invalid course selected.' }, { status: 400 });
        }

        const { slopeRating, courseRating, par } = selectedCourse;

        // Adjust courseRating for 9 holes
        const adjustedCourseRating = holes === 9 ? courseRating / 2 : courseRating;

        // Adjust slopeRating for 9 holes
        const adjustedHandicap = holes === 9 ? handicap / 2 : handicap;

        // Calculate net score
        const netScore = Math.round(
            score - adjustedCourseRating - (adjustedHandicap * slopeRating) / 113
        );

        // Save the score
        const newScore = new Score({
            userId,
            courseId,
            course,
            date,
            score,
            handicap, // Save the full handicap
            netScore, // Store the calculated net score
            holes,
        });

        const savedScore = await newScore.save();

        return NextResponse.json({ message: 'Score created successfully.', score: savedScore }, { status: 201 });
    } catch (error) {
        console.error('Error creating score:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json({ message: 'Error saving score', error: errorMessage }, { status: 500 });
    }
}
