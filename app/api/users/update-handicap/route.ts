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
                // Fetch course details for the score
                const course = await Course.findById(score.courseId);

                if (!course) {
                    console.error(`Course not found for courseId: ${score.courseId}`);
                    return null;
                }

                const { slopeRating, courseRating } = course;

                // Calculate differential
                const differential = ((score.score - courseRating) * 113) / slopeRating;
                return differential;
            })
        );

        // Filter out null differentials (if a course wasn't found)
        const validDifferentials = differentials.filter((d) => d !== null);

        if (validDifferentials.length === 0) {
            return NextResponse.json(
                { message: 'No valid scores with course data available.' },
                { status: 400 }
            );
        }

        // Sort differentials in ascending order (lower is better)
        validDifferentials.sort((a, b) => a - b);

        // Select the best differentials (e.g., top 8 out of the last 20)
        const bestDifferentials = validDifferentials.slice(0, 8);

        // Calculate the average of the best differentials
        const averageDifferential =
            bestDifferentials.reduce((acc, diff) => acc + diff, 0) /
            bestDifferentials.length;

        // Multiply by 0.96 for the official handicap index adjustment
        let newHandicap = Math.max(averageDifferential * 0.96, 0);

        // Round to the nearest integer
        newHandicap = Math.round(newHandicap);

        // Update the user's handicap in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { handicap: newHandicap },
            { new: true }
        );

        // Generate a new token with the updated handicap
        const token = sign(
            {
                userId: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                role: updatedUser.role,
                handicap: updatedUser.handicap, // Ensure it's the rounded integer value
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
        return NextResponse.json(
            { message: 'Error updating handicap', error: error.message },
            { status: 500 }
        );
    }
}
