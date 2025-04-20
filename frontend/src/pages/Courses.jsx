import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, addMonths, subMonths } from 'date-fns';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
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

    // Fetch courses data
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/courses', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourses(response.data);

                // Extract schedule from courses
                const newSchedule = response.data.flatMap(course =>
                    course.schedule.map(event => ({
                        ...event,
                        courseTitle: course.title
                    }))
                );
                setSchedule(newSchedule);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    // Filter courses based on active tab
    const filteredCourses = courses.filter(course => {
        if (activeTab === 'All') return true;
        return course.status === activeTab;
    });

    // Calendar navigation handlers
    const handlePrevMonth = () => {
        setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
    };

    // Generate calendar dates
    const generateCalendarDates = () => {
        const today = new Date();
        const dates = [];
        for (let i = 0; i < 7; i++) {
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
        return format(eventDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    });

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Main Content - Course List */}
            <div className="flex-1 p-8 pr-96"> {/* Added right padding to accommodate sidebar */}
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">My Courses</h1>
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Course Tabs */}
                <div className="flex space-x-6 mb-8">
                    {['All', 'Active', 'Upcoming', 'Completed'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${activeTab === tab
                                ? 'bg-purple-100 text-purple-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Course List */}
                <div className="grid gap-6">
                    {filteredCourses.map((course) => (
                        <div
                            key={course._id}
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex items-start gap-6">
                                <div className="w-48 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                                    {course.icon || (
                                        <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{course.description}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-sm text-purple-600 font-medium">
                                                Start: {course.startDate ? format(new Date(course.startDate), 'MMM d, yyyy') : 'TBA'}
                                            </span>
                                            <div className="ml-4 flex items-center space-x-1">
                                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="text-sm text-gray-600">{course.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center space-x-4">
                                        {course.tags?.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel - Calendar (changed from fixed to sticky) */}
            <div className="w-80 bg-white min-h-screen sticky top-0 right-0 shadow-lg p-6 overflow-y-auto">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
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
                                className={`p-2 rounded-lg text-sm ${format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                                    ? 'bg-purple-100 text-purple-700 font-medium'
                                    : 'hover:bg-gray-100'
                                    }`}
                            >
                                {format(date, 'd')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Schedule */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Schedule</h2>
                        <div className="text-sm text-gray-500">
                            {format(selectedDate, 'MMMM d, yyyy')}
                        </div>
                    </div>
                    <div className="space-y-3">
                        {filteredSchedule.map((event, index) => (
                            <div key={index} className="bg-purple-50 p-3 rounded-lg">
                                <div className="text-sm font-medium text-purple-700">{event.title}</div>
                                <div className="text-xs text-purple-600 mt-1">{event.time}</div>
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
                                    className="w-full bg-purple-500 rounded-t"
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