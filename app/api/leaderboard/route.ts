// app/api/leaderboard/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Score from '@/models/Score';
import User from '@/models/User';
import Course from '@/models/Course';

export const dynamic = 'force-dynamic';

export async function GET() {
    await connectToDatabase();

    try {
        // Aggregate user scores
        const leaderboard = await Score.aggregate([
            {
                $group: {
                    _id: '$userId',
                    totalRounds: { $sum: 1 }, // Count total rounds
                    bestScore: {
                        $min: {
                            $cond: [{ $eq: ['$holes', 18] }, { score: '$score', courseId: '$courseId' }, null],
                        },
                    }, // Best score with course ID
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' }, // Flatten user array
            {
                $lookup: {
                    from: 'courses',
                    localField: 'bestScore.courseId',
                    foreignField: '_id',
                    as: 'bestCourse',
                },
            },
            { $unwind: { path: '$bestCourse', preserveNullAndEmptyArrays: true } }, // Include course name
            {
                $project: {
                    _id: 0,
                    name: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
                    totalRounds: 1,
                    bestScore: '$bestScore.score',
                    bestCourseName: '$bestCourse.name',
                    handicap: '$user.handicap',
                },
            },
            { $sort: { handicap: 1, bestScore: 1 } }, // Sort by handicap, then best score
        ]);

        const response = NextResponse.json(leaderboard, { status: 200 });
        response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
        return response;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json({ message: 'Error fetching courses', error: errorMessage }, { status: 500 });
    }
}
