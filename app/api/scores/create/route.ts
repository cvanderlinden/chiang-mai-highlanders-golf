// app/api/scores/create/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Score from '@/models/Score';

export async function POST(request: Request) {
    try {
        const { userId, courseId, course, date, score, handicap, netScore, holes } = await request.json();

        await connectToDatabase();

        // Adjust handicap for 9-hole games
        const adjustedHandicap = holes === 9 ? Math.round( handicap / 2 ) : handicap;

        // Recalculate netScore server-side for accuracy
        const recalculatedNetScore = Math.round(
            score - (adjustedHandicap * 113) / 113 // Simplified server-side calculation
        );

        const newScore = new Score({
            userId,
            courseId,
            course,
            date,
            score,
            handicap,
            netScore: recalculatedNetScore,
            holes,
        });

        const savedScore = await newScore.save();

        return NextResponse.json({ message: 'Score created successfully.', score: savedScore }, { status: 201 });
    } catch (error) {
        console.error('Error creating score:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json({ message: 'Error fetching courses', error: errorMessage }, { status: 500 });
    }
}