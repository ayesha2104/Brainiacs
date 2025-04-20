const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coursesCompleted: {
        type: Number,
        default: 0
    },
    coursesCompletedChange: {
        type: Number,
        default: 0
    },
    averageScore: {
        type: Number,
        default: 0
    },
    averageScoreChange: {
        type: Number,
        default: 0
    },
    studyHours: {
        type: Number,
        default: 0
    },
    studyHoursChange: {
        type: Number,
        default: 0
    },
    assignmentsCompleted: {
        type: Number,
        default: 0
    },
    assignmentsCompletedChange: {
        type: Number,
        default: 0
    },
    progressData: [{
        date: Date,
        value: Number
    }],
    recentAchievements: [{
        title: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Statistics', statisticsSchema); 