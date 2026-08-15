import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import axios from '../utils/axios';

const CourseCard = ({ course, isEnrolled, onEnroll, onUnenroll, enrolling }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex justify-between items-center">
                <span className="text-blue-600 font-medium">{course.instructor}</span>
                {isEnrolled ? (
                    <button
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-60"
                        onClick={() => onUnenroll(course._id)}
                        disabled={enrolling}
                    >
                        Unenroll
                    </button>
                ) : (
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-60"
                        onClick={() => onEnroll(course._id)}
                        disabled={enrolling}
                    >
                        Enroll
                    </button>
                )}
            </div>
        </div>
    );
};

const Courses = () => {
    const currentUser = useSelector((state) => state.auth.user);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrollingId, setEnrollingId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [schedule, setSchedule] = useState([]);

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('/courses');
            const courseList = response.data.data;
            setCourses(courseList);

            const newSchedule = courseList.flatMap((course) =>
                course.schedule ? course.schedule.map((event) => ({
                    ...event,
                    courseTitle: course.title
                })) : []
            );
            setSchedule(newSchedule);
        } catch {
            setError('Failed to load courses. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const isEnrolled = (course) =>
        currentUser && course.enrolledStudents?.includes(currentUser._id);

    const handleEnroll = async (courseId) => {
        setEnrollingId(courseId);
        try {
            await axios.post(`/courses/${courseId}/enroll`);
            toast.success('Enrolled successfully!');
            await fetchCourses();
        } catch {
            toast.error('Failed to enroll. Please try again.');
        } finally {
            setEnrollingId(null);
        }
    };

    const handleUnenroll = async (courseId) => {
        setEnrollingId(courseId);
        try {
            await axios.delete(`/courses/${courseId}/enroll`);
            toast.success('Unenrolled.');
            await fetchCourses();
        } catch {
            toast.error('Failed to unenroll. Please try again.');
        } finally {
            setEnrollingId(null);
        }
    };

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

    // Total hours spent across enrolled courses (real data from Course.hoursSpent)
    const totalHoursSpent = currentUser
        ? courses.reduce((sum, course) => {
            const hours = course.hoursSpent?.[currentUser._id] || 0;
            return sum + hours;
        }, 0)
        : 0;

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
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6 text-red-700">
                            {error}
                        </div>
                    )}
                    {!error && courses.length === 0 && (
                        <div className="text-gray-500">No courses are available yet.</div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <CourseCard
                                key={course._id}
                                course={course}
                                isEnrolled={isEnrolled(course)}
                                onEnroll={handleEnroll}
                                onUnenroll={handleUnenroll}
                                enrolling={enrollingId === course._id}
                            />
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

                {/* Hours Spent */}
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2">Hours spent</h2>
                    <div className="text-3xl font-bold text-blue-600">{totalHoursSpent}h</div>
                    <p className="text-xs text-gray-500 mt-1">Total across your enrolled courses</p>
                </div>
            </div>
        </div>
    );
};

export default Courses;
