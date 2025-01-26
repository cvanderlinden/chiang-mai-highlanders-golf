// app/api/scores/create/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Score from '@/models/Score';

export async function POST(request: Request) {
    try {
        const { userId, courseId, course, date, score, handicap, netScore, holes } = await request.json();

        await connectToDatabase();

        const newScore = new Score({
            userId,
            courseId,
            course,
            date,
            score,
            handicap,
            netScore,
            holes,
        });

        const savedScore = await newScore.save();

        return NextResponse.json({ message: 'Score created successfully.', score: savedScore }, { status: 201 });
    } catch (error) {
        console.error('Error creating score:', error);
        return NextResponse.json({ message: 'Error creating score', error: error.message }, { status: 500 });
    }
}