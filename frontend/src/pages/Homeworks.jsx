import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomeworkCard = ({ homework, onStatusChange }) => {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800',
        overdue: 'bg-red-100 text-red-800'
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800">{homework.title}</h3>
                    <p className="text-gray-600 mt-2">{homework.description}</p>
                    <div className="mt-4">
                        <span className="text-sm text-gray-500">Course: {homework.courseName}</span>
                        <span className="mx-2">•</span>
                        <span className="text-sm text-gray-500">Due: {new Date(homework.dueDate).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[homework.status]}`}>
                        {homework.status.charAt(0).toUpperCase() + homework.status.slice(1)}
                    </span>
                    {homework.status !== 'completed' && (
                        <button
                            onClick={() => onStatusChange(homework._id, 'completed')}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Mark as Complete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const Homeworks = () => {
    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    // Mock data for testing
    const mockHomeworks = [
        {
            _id: '1',
            title: 'Python Programming Assignment',
            description: 'Complete exercises on variables and data types',
            courseName: 'Introduction to Programming',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: 'pending'
        },
        {
            _id: '2',
            title: 'Web Development Project',
            description: 'Create a responsive landing page using HTML, CSS, and JavaScript',
            courseName: 'Web Development',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            status: 'pending'
        },
        {
            _id: '3',
            title: 'Data Structures Implementation',
            description: 'Implement a binary search tree and perform basic operations',
            courseName: 'Data Structures',
            dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            status: 'overdue'
        },
        {
            _id: '4',
            title: 'Algorithm Analysis',
            description: 'Analyze time complexity of sorting algorithms and submit report',
            courseName: 'Data Structures',
            dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            status: 'completed'
        }
    ];

    useEffect(() => {
        fetchHomeworks();
    }, []);

    const fetchHomeworks = async () => {
        try {
            const response = await axios.get('/api/homeworks');
            // Ensure we have an array of homeworks
            const homeworksData = Array.isArray(response.data) ? response.data : [];
            setHomeworks(homeworksData);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch homeworks:', error);
            // Use mock data as fallback
            setHomeworks(mockHomeworks);
            setLoading(false);
        }
    };

    const handleStatusChange = async (homeworkId, newStatus) => {
        try {
            await axios.patch(`/api/homeworks/${homeworkId}`, { status: newStatus });
            fetchHomeworks(); // Refresh the list
        } catch (error) {
            console.error('Failed to update homework status:', error);
            // If API fails, update local state
            setHomeworks(prevHomeworks => {
                // Ensure prevHomeworks is an array
                if (!Array.isArray(prevHomeworks)) return mockHomeworks;
                return prevHomeworks.map(hw =>
                    hw._id === homeworkId ? { ...hw, status: newStatus } : hw
                );
            });
        }
    };

    // Ensure homeworks is always an array before filtering
    const safeHomeworks = Array.isArray(homeworks) ? homeworks : [];
    const filteredHomeworks = safeHomeworks.filter(homework => {
        if (filter === 'all') return true;
        return homework.status === filter;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">Homeworks</h1>
                    <div className="flex flex-wrap gap-2">
                        {['all', 'pending', 'completed', 'overdue'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-md transition-colors ${filter === status
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    {filteredHomeworks.length > 0 ? (
                        filteredHomeworks.map((homework) => (
                            <HomeworkCard
                                key={homework._id}
                                homework={homework}
                                onStatusChange={handleStatusChange}
                            />
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-gray-500 text-lg">No homeworks found for the selected filter.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Homeworks; 