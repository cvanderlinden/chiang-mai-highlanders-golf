// lib/initializeAdmin.ts

import bcrypt from 'bcryptjs';
import connectToDatabase from './mongoose';
import User from '@/models/User';

export async function initializeAdmin() {
    await connectToDatabase();

    const adminEmail = 'craig.vanderlinden@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('cmhg_admin_2024', 10);

        const adminUser = new User({
            firstName: 'Craig',
            lastName: 'Vanderlinden',
            email: adminEmail,
            passwordHash: hashedPassword,
            role: 'administrator',
            status: 'approved',
        });

        await adminUser.save();
        console.log('Default admin user created');
    } else {
        console.log('Admin user already exists');
    }
}
