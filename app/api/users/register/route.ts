// app/api/users/register/route.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import { sendEmail } from '@/lib/email'; // Import the sendEmail function

export async function POST(request: Request) {
    const { firstName, lastName, email, password } = await request.json();

    if (!firstName || !lastName || !email || !password) {
        return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'Email already in use.' }, { status: 400 });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            passwordHash,
            handicap: 18,
            status: 'pending',
            role: 'member', // Default role
        });

        await newUser.save();

        return NextResponse.json({ message: 'User registered successfully.' }, { status: 201 });
    } catch (error) {
        console.error('Error registering user:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}