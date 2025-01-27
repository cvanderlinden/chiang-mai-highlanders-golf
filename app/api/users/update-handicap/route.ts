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

        // Fetch the user's scores
        const scores = await Score.find({ userId }).sort({ date: -1 });

        if (scores.length === 0) {
            console.error(`No scores found for user: ${userId}`);
            return NextResponse.json(
                { message: 'No scores available for this user.' },
                { status: 400 }
            );
        }

        // Calculate differentials
        const differentials = await Promise.all(
            scores.map(async (score) => {
                const course = await Course.findById(score.courseId);

                if (!course) {
                    console.error(`Course not found for courseId: ${score.courseId}`);
                    return null;
                }

                const { slopeRating, courseRating } = course;

                if (!slopeRating || !courseRating) {
                    console.error(`Invalid course data for courseId: ${score.courseId}`);
                    return null;
                }

                // Adjust for 9 holes
                const adjustedCourseRating = score.holes === 9 ? courseRating / 2 : courseRating;
                const adjustedSlopeRating = score.holes === 9 ? slopeRating : slopeRating;

                const differential = ((score.score - adjustedCourseRating) * 113) / adjustedSlopeRating;
                return differential;
            })
        );


        // Filter out invalid differentials
        const validDifferentials = differentials.filter((d) => d !== null);

        if (validDifferentials.length === 0) {
            console.error(`No valid differentials found for user: ${userId}`);
            return NextResponse.json(
                { message: 'No valid scores with course data available.' },
                { status: 400 }
            );
        }

        validDifferentials.sort((a, b) => a - b);

        // Use the best 8 differentials
        const bestDifferentials = validDifferentials.slice(0, 8);
        const averageDifferential =
            bestDifferentials.reduce((acc, diff) => acc + diff, 0) /
            bestDifferentials.length;

        let newHandicap = Math.max(averageDifferential * 0.96, 0);
        newHandicap = Math.round(newHandicap);

        console.log(`Calculated handicap for user ${userId}: ${newHandicap}`);

        // Update the user's handicap
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { handicap: newHandicap },
            { new: true }
        );

        if (!updatedUser) {
            console.error(`User not found for userId: ${userId}`);
            return NextResponse.json(
                { message: 'User not found.' },
                { status: 404 }
            );
        }

        console.log(`Updated user: ${updatedUser}`);

        // Generate a new token with the updated handicap
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

