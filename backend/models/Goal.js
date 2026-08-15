import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        enum: ['academic', 'skill', 'personal', 'other'],
        default: 'academic',
    },
    targetDate: {
        type: Date,
        required: true,
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active',
    },
}, {
    timestamps: true,
});

goalSchema.index({ student: 1, status: 1 });

export default mongoose.model('Goal', goalSchema);
