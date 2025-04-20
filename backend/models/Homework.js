import mongoose from 'mongoose';

const homeworkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'overdue'],
        default: 'pending'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    submissionUrl: String,
    submissionDate: Date,
    grade: {
        type: Number,
        min: 0,
        max: 100
    },
    feedback: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Homework', homeworkSchema); 