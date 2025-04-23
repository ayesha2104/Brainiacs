import React, { useState } from 'react';
import axios from '../../utils/axios';

function TeacherHomework() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseName: '',
    dueDate: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate all fields
    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please enter a description');
      return;
    }
    if (!formData.courseName.trim()) {
      setError('Please enter a course name');
      return;
    }
    if (!formData.dueDate) {
      setError('Please select a due date');
      return;
    }

    try {
      console.log('Submitting homework with data:', formData);
      
      // Format the data according to backend expectations
      const homeworkData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString()
      };

      console.log('Sending request to /homeworks with data:', homeworkData);
      const response = await axios.post('/homeworks', homeworkData);
      console.log('Response from server:', response.data);

      if (response.data) {
        setSuccess('Homework assigned successfully!');
        setFormData({
          title: '',
          description: '',
          courseName: '',
          dueDate: ''
        });
      }
    } catch (error) {
      console.error('Error assigning homework:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response) {
        setError(error.response.data.message || 'Failed to assign homework. Please try again.');
      } else {
        setError('Failed to assign homework. Please try again.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Assign Homework</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              rows="3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Name</label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="datetime-local"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Assign Homework
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TeacherHomework; 