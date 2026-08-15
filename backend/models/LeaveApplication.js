import mongoose from 'mongoose';

const leaveApplicationSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
        enum: ['sick', 'casual', 'emergency', 'vacation', 'other'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

leaveApplicationSchema.index({ teacher: 1, status: 1 });

export default mongoose.model('LeaveApplication', leaveApplicationSchema);
