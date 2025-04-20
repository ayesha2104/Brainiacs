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
    startDate: {
        type: Date,
        required: true,
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

export default mongoose.model('Course', courseSchema); 