// app/api/scores/delete/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Score from '@/models/Score';
import User from '@/models/User';
import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
    try {
        const { scoreId, userId, isAdmin } = await request.json();

        await connectToDatabase();

        const score = await Score.findById(scoreId);
        if (!score) {
            return NextResponse.json({ message: 'Score not found.' }, { status: 404 });
        }

        if (!isAdmin && score.userId.toString() !== userId) {
            return NextResponse.json({ message: 'Unauthorized to delete this score.' }, { status: 403 });
        }

        await Score.findByIdAndDelete(scoreId);

        console.log('Score deleted:', scoreId);

        // Recalculate the handicap
        const scores = await Score.find({ userId }).sort({ date: -1 });
        if (scores.length > 0) {
            const differentials = scores.map((s) => {
                const slopeRating = 113; // Replace with actual slope rating if available
                const courseRating = 72; // Replace with actual course rating if available
                return ((s.score - courseRating) * 113) / slopeRating;
            });

            const validDifferentials = differentials.sort((a, b) => a - b).slice(0, 8);
            const averageDifferential = validDifferentials.reduce((acc, d) => acc + d, 0) / validDifferentials.length;
            const newHandicap = Math.round(averageDifferential * 0.96);

            // Update user handicap
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
                    handicap: updatedUser.handicap,
                },
                JWT_SECRET,
                { expiresIn: '30d' }
            );

            return NextResponse.json(
                {
                    message: 'Score deleted and handicap updated successfully.',
                    handicap: updatedUser.handicap,
                    token,
                },
                { status: 200 }
            );
        }

        return NextResponse.json({ message: 'Score deleted successfully, but no other scores to recalculate handicap.' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting score:', error);
        return NextResponse.json({ message: 'Error deleting score.', error: error.message }, { status: 500 });
    }
}
