import mongoose, { Schema, Document, Model } from 'mongoose';

interface IGolfer {
    userId: mongoose.Types.ObjectId; // Reference to the User model
    name: string;
}

interface ITeeOff extends Document {
    courseId: mongoose.Types.ObjectId; // Reference to the Course model
    courseName: string; // Keep courseName for easy display
    date: string;
    time: string;
    golfers: IGolfer[];
    createdBy: mongoose.Types.ObjectId; // Reference to the User model
    status: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
}

const GolferSchema: Schema<IGolfer> = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    name: { type: String, required: true },
});

const TeeOffSchema: Schema<ITeeOff> = new Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Reference to Course
    courseName: { type: String, required: true }, // Course name for display purposes
    date: { type: String, required: true },
    time: { type: String, required: true },
    golfers: { type: [GolferSchema], default: [] }, // Array of golfers
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    status: { type: String, required: true, default: 'active' }, // Active, cancelled, etc.
    type: { type: String, required: true, default: 'standard' }, // Tee-off type
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Create or reuse the model
const TeeOff: Model<ITeeOff> = mongoose.models?.TeeOff || mongoose.model<ITeeOff>('TeeOff', TeeOffSchema);

export default TeeOff;
