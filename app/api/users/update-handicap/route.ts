// app/api/users/update-handicap/route.ts
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Score from '@/models/Score';
import User from '@/models/User';
import Course from '@/models/Course';
import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
    try {
        const { userId } = await request.json();

        await connectToDatabase();

        // Fetch the user's scores, sorted by date (newest first)
        const scores = await Score.find({ userId }).sort({ date: -1 });

        if (scores.length === 0) {
            return NextResponse.json(
                { message: 'No scores available for this user.' },
                { status: 400 }
            );
        }

        // Calculate differentials for all scores
        const differentials = await Promise.all(
            scores.map(async (score) => {
                const course = await Course.findById(score.courseId);

                if (!course) {
                    console.error(`Course not found for courseId: ${score.courseId}`);
                    return null;
                }

                const { slopeRating, courseRating } = course;
                const differential = ((score.score - courseRating) * 113) / slopeRating;
                return differential;
            })
        );

        const validDifferentials = differentials.filter((d) => d !== null);

        if (validDifferentials.length === 0) {
            return NextResponse.json(
                { message: 'No valid scores with course data available.' },
                { status: 400 }
            );
        }

        validDifferentials.sort((a, b) => a - b);

        const bestDifferentials = validDifferentials.slice(0, 8);
        const averageDifferential =
            bestDifferentials.reduce((acc, diff) => acc + diff, 0) /
            bestDifferentials.length;

        let newHandicap = Math.max(averageDifferential * 0.96, 0);
        newHandicap = Math.round(newHandicap);

        // Update the user's handicap in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { handicap: newHandicap },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { message: 'User not found.' },
                { status: 404 }
            );
        }

        const token = sign(
            {
                userId: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                role: updatedUser.role,
                handicap: updatedUser.handicap,
            },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        return NextResponse.json(
            { message: 'Handicap updated successfully.', handicap: updatedUser.handicap, token },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating handicap:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json(
            { message: 'Error updating handicap', error: errorMessage },
            { status: 500 }
        );
    }
}
