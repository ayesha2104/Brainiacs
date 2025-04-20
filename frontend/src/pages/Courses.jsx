import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseCard = ({ course }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex justify-between items-center">
                <span className="text-blue-600 font-medium">{course.instructor}</span>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    onClick={() => window.location.href = `/course/${course._id}`}
                >
                    View Course
                </button>
            </div>
        </div>
    );
};

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [schedule, setSchedule] = useState([]);
    const [hoursData] = useState([
        { day: 'M', hours: 2 },
        { day: 'T', hours: 3 },
        { day: 'W', hours: 4 },
        { day: 'T', hours: 2 },
        { day: 'F', hours: 3 },
        { day: 'S', hours: 1 },
        { day: 'S', hours: 0 },
    ]);

    // Mock data for testing
    const mockCourses = [
        {
            _id: '1',
            title: 'Introduction to Programming',
            description: 'Learn the basics of programming with Python',
            instructor: 'Dr. Smith',
            schedule: [
                { date: new Date(), time: '10:00 AM', title: 'Lecture: Variables' }
            ]
        },
        {
            _id: '2',
            title: 'Web Development',
            description: 'Master HTML, CSS, and JavaScript',
            instructor: 'Prof. Johnson',
            schedule: [
                { date: new Date(), time: '2:00 PM', title: 'Workshop: React Basics' }
            ]
        },
        {
            _id: '3',
            title: 'Data Structures',
            description: 'Understanding fundamental data structures',
            instructor: 'Dr. Williams',
            schedule: [
                { date: new Date(), time: '11:30 AM', title: 'Lab: Arrays and Lists' }
            ]
        }
    ];

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('/api/courses');
                setCourses(response.data);
                setLoading(false);

                // Extract schedule from courses
                const newSchedule = response.data.flatMap(course =>
                    course.schedule ? course.schedule.map(event => ({
                        ...event,
                        courseTitle: course.title
                    })) : []
                );
                setSchedule(newSchedule);
            } catch {
                // If API fails, use mock data
                setCourses(mockCourses);
                const newSchedule = mockCourses.flatMap(course =>
                    course.schedule ? course.schedule.map(event => ({
                        ...event,
                        courseTitle: course.title
                    })) : []
                );
                setSchedule(newSchedule);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Calendar navigation handlers
    const handlePrevMonth = () => {
        setCurrentMonth(prevMonth => {
            const newDate = new Date(prevMonth);
            newDate.setMonth(prevMonth.getMonth() - 1);
            return newDate;
        });
    };

    const handleNextMonth = () => {
        setCurrentMonth(prevMonth => {
            const newDate = new Date(prevMonth);
            newDate.setMonth(prevMonth.getMonth() + 1);
            return newDate;
        });
    };

    // Generate calendar dates
    const generateCalendarDates = () => {
        const dates = [];
        const today = new Date(currentMonth);
        today.setDate(1); // Start from the first day of the month
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

        for (let i = 0; i < daysInMonth; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    // Filter schedule for selected date
    const filteredSchedule = schedule.filter(event => {
        if (!event.date) return false;
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === selectedDate.toDateString();
    });

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Main Content - Course List */}
            <div className="flex-1 p-8 pr-96">
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Courses</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Calendar */}
            <div className="w-96 bg-white min-h-screen sticky top-0 right-0 shadow-lg p-6 overflow-y-auto">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">
                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={handlePrevMonth}
                                className="p-1 rounded hover:bg-gray-100"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={handleNextMonth}
                                className="p-1 rounded hover:bg-gray-100"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center mb-2">
                        {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((day) => (
                            <div key={day} className="text-xs text-gray-500 font-medium">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {generateCalendarDates().map((date, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedDate(date)}
                                className={`p-2 rounded-lg text-sm ${date.toDateString() === selectedDate.toDateString()
                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                    : 'hover:bg-gray-100'
                                    }`}
                            >
                                {date.getDate()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Schedule */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Schedule</h2>
                        <div className="text-sm text-gray-500">
                            {selectedDate.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                    <div className="space-y-3">
                        {filteredSchedule.map((event, index) => (
                            <div key={index} className="bg-blue-50 p-3 rounded-lg">
                                <div className="text-sm font-medium text-blue-700">{event.title}</div>
                                <div className="text-xs text-blue-600 mt-1">{event.time}</div>
                                <div className="text-xs text-gray-500 mt-1">{event.courseTitle}</div>
                            </div>
                        ))}
                        {filteredSchedule.length === 0 && (
                            <div className="text-sm text-gray-500 text-center py-4">
                                No events scheduled for this day
                            </div>
                        )}
                    </div>
                </div>

                {/* Hours Spent Chart */}
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-4">Hours spent</h2>
                    <div className="flex items-end space-x-2 h-32">
                        {hoursData.map((data, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-blue-500 rounded-t"
                                    style={{ height: `${(data.hours / 4) * 100}%` }}
                                />
                                <div className="text-xs text-gray-500 mt-2">{data.day}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Courses;
