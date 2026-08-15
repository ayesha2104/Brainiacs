import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import axios from '../utils/axios';

const emptyForm = { title: '', description: '', category: 'academic', targetDate: '' };

const CATEGORY_LABELS = {
    academic: 'Academic',
    skill: 'Skill',
    personal: 'Personal',
    other: 'Other',
};

const GoalCard = ({ goal, onUpdateProgress, onDelete, updating }) => {
    const isCompleted = goal.status === 'completed';
    const overdue = !isCompleted && new Date(goal.targetDate) < new Date();

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-700 mb-2">
                        {CATEGORY_LABELS[goal.category] || goal.category}
                    </span>
                    <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                    {goal.description && <p className="text-sm text-gray-500 mt-1">{goal.description}</p>}
                </div>
                <button
                    onClick={() => onDelete(goal._id)}
                    className="text-gray-400 hover:text-red-500 text-sm"
                    disabled={updating}
                    aria-label="Delete goal"
                >
                    Delete
                </button>
            </div>

            <div className="flex items-center justify-between text-sm mb-2">
                <span className={overdue ? 'text-red-500 font-medium' : 'text-gray-500'}>
                    Target: {new Date(goal.targetDate).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {overdue && ' (overdue)'}
                </span>
                <span className="font-semibold text-gray-700">{goal.progress}%</span>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
                <div
                    className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-purple-500 to-indigo-600'}`}
                    style={{ width: `${goal.progress}%` }}
                ></div>
            </div>

            {isCompleted ? (
                <span className="text-sm font-medium text-green-600">✓ Completed</span>
            ) : (
                <div className="flex gap-2">
                    <button
                        onClick={() => onUpdateProgress(goal._id, Math.min(100, goal.progress + 25))}
                        disabled={updating}
                        className="text-sm px-3 py-1 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 disabled:opacity-50"
                    >
                        +25% progress
                    </button>
                    <button
                        onClick={() => onUpdateProgress(goal._id, 100)}
                        disabled={updating}
                        className="text-sm px-3 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 disabled:opacity-50"
                    >
                        Mark complete
                    </button>
                </div>
            )}
        </div>
    );
};

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [filter, setFilter] = useState('all');

    const fetchGoals = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get('/goals', { params: { limit: 50 } });
            setGoals(res.data.data);
        } catch (err) {
            console.error('Failed to fetch goals:', err);
            setError('Failed to load your goals. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await axios.post('/goals', formData);
            setGoals((prev) => [...prev, res.data]);
            toast.success('Goal added!');
            setFormData(emptyForm);
            setShowForm(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add goal.');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateProgress = async (goalId, progress) => {
        setUpdatingId(goalId);
        try {
            const res = await axios.patch(`/goals/${goalId}`, { progress });
            setGoals((prev) => prev.map((g) => (g._id === goalId ? res.data : g)));
            if (res.data.status === 'completed') {
                toast.success('Goal completed! 🎉');
            }
        } catch {
            toast.error('Failed to update progress.');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (goalId) => {
        setUpdatingId(goalId);
        try {
            await axios.delete(`/goals/${goalId}`);
            setGoals((prev) => prev.filter((g) => g._id !== goalId));
            toast.success('Goal removed.');
        } catch {
            toast.error('Failed to delete goal.');
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredGoals = goals.filter((g) => filter === 'all' || g.status === filter);

    return (
        <div className="max-w-5xl mx-auto p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Your Goals</h1>
                    <p className="text-gray-600">Track what you're working toward and how far along you are.</p>
                </div>
                <button
                    onClick={() => setShowForm((v) => !v)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    {showForm ? 'Cancel' : 'Add Goal'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="2"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            >
                                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Target Date</label>
                            <input
                                type="date"
                                name="targetDate"
                                value={formData.targetDate}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-60"
                    >
                        {saving ? 'Saving...' : 'Save Goal'}
                    </button>
                </form>
            )}

            <div className="flex gap-2 mb-6">
                {['all', 'active', 'completed'].map((value) => (
                    <button
                        key={value}
                        onClick={() => setFilter(value)}
                        className={`px-3 py-1 rounded-full text-sm ${filter === value
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-600 border border-gray-200'
                            }`}
                    >
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
            ) : error ? (
                <div className="bg-white rounded-lg shadow p-8 text-center text-red-600">{error}</div>
            ) : filteredGoals.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                    {goals.length === 0 ? "You haven't set any goals yet. Add one to get started!" : 'No goals match this filter.'}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredGoals.map((goal) => (
                        <GoalCard
                            key={goal._id}
                            goal={goal}
                            onUpdateProgress={handleUpdateProgress}
                            onDelete={handleDelete}
                            updating={updatingId === goal._id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Goals;
