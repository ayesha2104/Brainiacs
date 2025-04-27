import React, { useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-hot-toast';

function TeacherLeaveApplication() {
  const [formData, setFormData] = useState({
    title: '',
    reason: '',
    startDate: '',
    endDate: '',
    type: 'sick'
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Since the backend leave application API doesn't exist yet,
      // we'll use local storage to simulate the functionality temporarily
      
      // Get existing applications from localStorage
      const existingApplications = JSON.parse(localStorage.getItem('leaveApplications') || '[]');
      
      // Create a new application with ID and timestamp
      const newApplication = {
        id: Date.now().toString(),
        ...formData,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };
      
      // Add the new application to the list
      existingApplications.push(newApplication);
      
      // Save back to localStorage
      localStorage.setItem('leaveApplications', JSON.stringify(existingApplications));
      
      // Show success message
      toast.success('Leave application submitted successfully!');
      
      // Reset form data
      setFormData({
        title: '',
        reason: '',
        startDate: '',
        endDate: '',
        type: 'sick'
      });
      
      // Mark as submitted
      setSubmitted(true);
      
      // When the backend API is implemented, use the following code:
      /*
      const response = await axios.post('/api/teacher/leave-applications', formData);
      
      if (response.data) {
        toast.success('Leave application submitted successfully!');
        setFormData({
          title: '',
          reason: '',
          startDate: '',
          endDate: '',
          type: 'sick'
        });
        setSubmitted(true);
      }
      */
    } catch (error) {
      console.error('Error submitting leave application:', error);
      
      let errorMessage = 'Failed to submit leave application. Please try again.';
      
      // Check if we have a specific error message from the server
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'The leave application service is currently unavailable. Please try again later.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to the server. Please check your internet connection.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-4">Leave Application Submitted</h2>
          <p className="text-gray-600 mb-6">
            Your leave application has been submitted successfully. You will be notified once it's approved.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Apply for Leave</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Leave Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            >
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="emergency">Emergency Leave</option>
              <option value="vacation">Vacation Leave</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief reason for leave"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Detailed Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Please explain your reason for requesting leave"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              rows="3"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Leave Application'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TeacherLeaveApplication;