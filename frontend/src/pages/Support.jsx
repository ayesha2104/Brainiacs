import React, { useState } from 'react';
import axios from 'axios';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 py-4">
            <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-lg font-medium text-gray-900">{question}</h3>
                <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>
            {isOpen && (
                <div className="mt-4 text-gray-600">
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};

const Support = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    const faqs = [
        {
            question: 'How do I reset my password?',
            answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page. Follow the instructions sent to your email to create a new password.'
        },
        {
            question: 'How do I submit an assignment?',
            answer: 'Navigate to the Homeworks section, find your assignment, and click on "Submit". You can upload your work and add any necessary comments before submitting.'
        },
        {
            question: 'Can I download course materials for offline viewing?',
            answer: 'Yes, most course materials are available for download. Look for the download icon next to the course content you want to save for offline access.'
        },
        {
            question: 'How do I track my progress?',
            answer: 'Your progress is automatically tracked in the Statistics section. You can view detailed analytics about your course completion, grades, and study time.'
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Sending your request...' });

        try {
            await axios.post('/api/support/tickets', formData);
            setStatus({
                type: 'success',
                message: 'Your request has been submitted successfully!'
            });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'Failed to submit your request. Please try again.'
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Need Help?</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Help Request Form */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact Support</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Message
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Submit Request
                        </button>
                        {status.message && (
                            <div
                                className={`mt-4 p-4 rounded-md ${status.type === 'success'
                                        ? 'bg-green-100 text-green-800'
                                        : status.type === 'error'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-blue-100 text-blue-800'
                                    }`}
                            >
                                {status.message}
                            </div>
                        )}
                    </form>
                </div>

                {/* FAQ Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-2">
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support; 