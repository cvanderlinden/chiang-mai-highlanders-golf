import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Score from '@/models/Score';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const scoreId = searchParams.get('id');

        if (!scoreId) {
            return NextResponse.json({ message: 'Score ID is required' }, { status: 400 });
        }

        await connectToDatabase();

        // Fetch the score with populated user and course fields
        const score = await Score.findById(scoreId)
            .populate('userId', 'firstName lastName')
            .populate('courseId', 'par');

        if (!score) {
            return NextResponse.json({ message: 'Score not found' }, { status: 404 });
        }

        return NextResponse.json({ score }, { status: 200 });
    } catch (error) {
        console.error('Error fetching score:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ message: 'Error fetching score', error: errorMessage }, { status: 500 });
    }
}
