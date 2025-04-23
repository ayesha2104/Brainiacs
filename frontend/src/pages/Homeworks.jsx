import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';

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
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    const fetchHomeworks = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/homeworks');
            setHomeworks(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching homeworks:', error);
            setError('Failed to fetch homeworks. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (homeworkId, newStatus) => {
        try {
            await axios.patch(`/homeworks/${homeworkId}/status`, { status: newStatus });
            // Refresh the homeworks list
            fetchHomeworks();
        } catch (error) {
            console.error('Error updating homework status:', error);
            alert('Failed to update homework status. Please try again.');
        }
    };

    useEffect(() => {
        fetchHomeworks();
    }, []);

    const filteredHomeworks = homeworks.filter(homework => {
        if (filter === 'all') return true;
        return homework.status === filter;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Homeworks</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-md ${filter === 'pending' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 rounded-md ${filter === 'completed' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Completed
                    </button>
                    <button
                        onClick={() => setFilter('overdue')}
                        className={`px-4 py-2 rounded-md ${filter === 'overdue' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Overdue
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {filteredHomeworks.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No homeworks found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredHomeworks.map(homework => (
                        <HomeworkCard
                            key={homework._id}
                            homework={homework}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Homeworks; 