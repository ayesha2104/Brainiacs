import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    instructor: {
        type: String,
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    materials: [{
        title: String,
        type: String,
        url: String,
        uploadDate: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Active', 'Upcoming', 'Completed'],
        default: 'Upcoming',
    },
    tags: [{
        type: String,
    }],
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    icon: {
        type: String,
    },
    schedule: [{
        title: String,
        date: Date,
        time: String,
        duration: Number, // in minutes
    }],
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    hoursSpent: {
        type: Map,
        of: Number,
        default: new Map(),
    },
}, {
    timestamps: true,
});

courseSchema.index({ enrolledStudents: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ teacher: 1 });

export default mongoose.model('Course', courseSchema);
