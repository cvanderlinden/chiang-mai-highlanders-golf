// app/api/scores/list/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Score from '@/models/Score';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        console.log('Fetching recent scores with limit:', limit);

        await connectToDatabase();

        // Retrieve all scores and populate user and course details
        const scores = await Score.find({})
            .sort({ date: -1 })
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

        return NextResponse.json({ scores: validScores, totalScores }, { status: 200 });
    } catch (error) {
        console.error('Error retrieving scores:', error);
        return NextResponse.json({ message: 'Error retrieving scores', error: error.message }, { status: 500 });
    }
}
