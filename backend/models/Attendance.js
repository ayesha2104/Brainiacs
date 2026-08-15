import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    records: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['present', 'absent'],
            required: true,
        },
    }],
}, {
    timestamps: true,
});

attendanceSchema.index({ teacher: 1, course: 1, date: 1 });

export default mongoose.model('Attendance', attendanceSchema);
