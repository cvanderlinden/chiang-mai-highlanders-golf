// models/User.ts

import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    role: string;
    status: string;
    handicap: number;
    createdAt: Date;
    updatedAt: Date;
    approvedBy: string | null;
}

const UserSchema: Schema<IUser> = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, default: 'member' },
    status: { type: String, required: true, default: 'pending' },
    handicap: { type: Number, required: true, default: 18 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    approvedBy: { type: String, default: null },
});

// Ensure mongoose.models is defined before trying to use it
const User: Model<IUser> = mongoose.models?.User || mongoose.model<IUser>('User', UserSchema);

export default User;
