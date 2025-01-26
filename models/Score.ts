// models/Score.ts

import mongoose, { Schema, Document, Model } from 'mongoose';

interface IScore extends Document {
    userId: mongoose.Types.ObjectId; // Reference to the User model
    courseId: mongoose.Types.ObjectId; // Reference to the Course model
    course: string;
    date: string;
    score: number;
    handicap: number;
    netScore: number;
    holes: number;
    createdAt: Date;
    updatedAt: Date;
}

const ScoreSchema: Schema<IScore> = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    course: { type: String, required: true },
    date: { type: String, required: true },
    score: { type: Number, required: true },
    handicap: { type: Number, required: true },
    netScore: { type: Number, required: true },
    holes: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Score: Model<IScore> = mongoose.models?.Score || mongoose.model<IScore>('Score', ScoreSchema);

export default Score;
