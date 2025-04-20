import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatCard = ({ title, value, change, icon: Icon }) => {
    const isPositive = change >= 0;
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                    <p className={`text-sm mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '↑' : '↓'} {Math.abs(change)}% from last month
                    </p>
                </div>
                {Icon && (
                    <div className="p-3 bg-blue-100 rounded-full">
                        <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                )}
            </div>
        </div>
    );
};

const ProgressChart = ({ data = [] }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Over Time</h3>
            <div className="h-48 flex items-end space-x-2">
                {data.map((value, index) => (
                    <div
                        key={index}
                        className="bg-blue-500 w-8 rounded-t-md transition-all duration-300"
                        style={{ height: `${(value / 100) * 100}%` }}
                    >
                        <div className="text-xs text-center mt-2 text-white">{value}%</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Statistics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock data for testing
    const mockStats = {
        coursesCompleted: 12,
        coursesCompletedChange: 20,
        averageScore: 85,
        averageScoreChange: 5,
        studyHours: 120,
        studyHoursChange: -10,
        assignmentsCompleted: 45,
        assignmentsCompletedChange: 15,
        progressData: [65, 70, 75, 80, 85, 82, 88],
        recentAchievements: [
            {
                title: 'Completed Python Course',
                date: '2 days ago'
            },
            {
                title: 'Perfect Score in Web Dev Quiz',
                date: '1 week ago'
            },
            {
                title: 'Submitted All Assignments',
                date: '2 weeks ago'
            },
            {
                title: '100 Study Hours Milestone',
                date: '1 month ago'
            }
        ]
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/statistics');
                // Validate and ensure all required properties exist
                const data = response.data || {};
                const validatedStats = {
                    coursesCompleted: data.coursesCompleted || 0,
                    coursesCompletedChange: data.coursesCompletedChange || 0,
                    averageScore: data.averageScore || 0,
                    averageScoreChange: data.averageScoreChange || 0,
                    studyHours: data.studyHours || 0,
                    studyHoursChange: data.studyHoursChange || 0,
                    assignmentsCompleted: data.assignmentsCompleted || 0,
                    assignmentsCompletedChange: data.assignmentsCompletedChange || 0,
                    progressData: Array.isArray(data.progressData) ? data.progressData : [],
                    recentAchievements: Array.isArray(data.recentAchievements) ? data.recentAchievements : []
                };
                setStats(validatedStats);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch statistics:', error);
                // Use mock data as fallback
                setStats(mockStats);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-500 text-lg">No statistics available at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Progress</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Courses Completed"
                        value={stats.coursesCompleted}
                        change={stats.coursesCompletedChange}
                        icon={() => (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    />
                    <StatCard
                        title="Average Score"
                        value={`${stats.averageScore}%`}
                        change={stats.averageScoreChange}
                        icon={() => (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        )}
                    />
                    <StatCard
                        title="Study Hours"
                        value={`${stats.studyHours}h`}
                        change={stats.studyHoursChange}
                        icon={() => (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    />
                    <StatCard
                        title="Assignments Completed"
                        value={stats.assignmentsCompleted}
                        change={stats.assignmentsCompletedChange}
                        icon={() => (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ProgressChart data={stats.progressData || []} />
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Achievements</h3>
                        <div className="space-y-4">
                            {(stats.recentAchievements || []).map((achievement, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{achievement.title}</p>
                                        <p className="text-sm text-gray-500">{achievement.date}</p>
                                    </div>
                                </div>
                            ))}
                            {(!stats.recentAchievements || stats.recentAchievements.length === 0) && (
                                <div className="text-center py-4">
                                    <p className="text-gray-500">No recent achievements yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics; 