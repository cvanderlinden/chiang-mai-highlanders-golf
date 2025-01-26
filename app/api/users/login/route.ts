// app/api/users/login/route.ts

import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
    const { email, password } = await request.json();

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const token = sign(
        {
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            handicap: user.handicap, // Include handicap in the token
        },
        JWT_SECRET,
        { expiresIn: '30d' }
    );
    console.log('Generated token:', token); // Debugging

    return NextResponse.json({
        message: 'Login successful',
        token,
        user: {
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            handicap: user.handicap,
        },
    }, { status: 200 });
}
