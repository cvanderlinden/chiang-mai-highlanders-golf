// models/Course.ts

import mongoose, { Schema, Document, Model } from 'mongoose';

interface ICourse extends Document {
    name: string;
    slopeRating: number;
    courseRating: number;
    par: number;
    mapLink: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const CourseSchema: Schema<ICourse> = new Schema({
    name: { type: String, required: true },
    slopeRating: { type: Number, required: true }, // Slope Rating for the course
    courseRating: { type: Number, required: true }, // Course Rating for the course
    par: { type: Number, required: true }, // Par for the course
    mapLink: { type: String, required: false }, // Optional map link
    status: { type: String, required: true, default: 'active' }, // Status of the course (active/inactive)
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Ensure mongoose.models is defined before trying to use it
const Course: Model<ICourse> = mongoose.models?.Course || mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
