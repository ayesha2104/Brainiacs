import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

dotenv.config();

const courses = [
    {
        title: 'Design Strategy',
        description: 'Lesson on planning a design concept and proper planning of work',
        instructor: 'Sarah Johnson',
        startDate: new Date('2024-05-05'),
        status: 'Active',
        tags: ['UX/UI Design', 'Web Design'],
        rating: 4.5,
        progress: 40,
        schedule: [
            {
                title: 'UX/UI workshop',
                date: new Date('2024-05-05'),
                time: '09:00 - 10:30',
                duration: 90
            }
        ]
    },
    {
        title: 'English Lecture',
        description: 'Language lectures with two most popular teachers',
        instructor: 'Michael Brown',
        startDate: new Date('2024-05-06'),
        status: 'Active',
        tags: ['Languages', 'English'],
        rating: 4.8,
        progress: 50,
        schedule: [
            {
                title: 'English Grammar',
                date: new Date('2024-05-06'),
                time: '11:00 - 12:30',
                duration: 90
            }
        ]
    },
    {
        title: 'Business Lecture',
        description: 'Lectures on how to build your business using advanced flow of new projects',
        instructor: 'David Wilson',
        startDate: new Date('2024-05-08'),
        status: 'Upcoming',
        tags: ['Marketing', 'Finance'],
        rating: 4.2,
        progress: 0,
        schedule: [
            {
                title: 'Business Strategy',
                date: new Date('2024-05-08'),
                time: '14:00 - 15:30',
                duration: 90
            }
        ]
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing courses
        await Course.deleteMany({});
        console.log('Cleared existing courses');

        // Insert new courses
        await Course.insertMany(courses);
        console.log('Added sample courses');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData(); 