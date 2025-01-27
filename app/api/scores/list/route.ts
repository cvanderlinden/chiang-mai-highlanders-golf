// app/api/scores/list/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Score from '@/models/Score';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        console.log('Fetching recent scores with limit:', limit);

        await connectToDatabase();

        // Retrieve all scores, sorted by createdAt (down to the second), and populate user and course details
        const scores = await Score.find({})
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .limit(limit)
            .populate('userId', 'firstName lastName') // Populate user details
            .populate('courseId', 'par'); // Populate course details (e.g., par)

        const totalScores = await Score.countDocuments(); // Total count for all scores

        console.log('Scores with courseId:', scores); // Debugging

        // Separate valid and invalid scores
        const validScores = scores.filter((score) => score.userId && score.courseId); // Ensure both userId and courseId are present
        const invalidScoreIds = scores
            .filter((score) => !score.userId || !score.courseId)
            .map((score) => score._id);

        if (invalidScoreIds.length > 0) {
            await Score.deleteMany({ _id: { $in: invalidScoreIds } });
            console.log(`Removed ${invalidScoreIds.length} invalid scores`);
        }

        // Prepare response with cache control
        const response = NextResponse.json({ scores: validScores, totalScores }, { status: 200 });
        response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
        return response;
    } catch (error) {
        console.error('Error retrieving scores:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json({ message: 'Error fetching scores', error: errorMessage }, { status: 500 });
    }
}
