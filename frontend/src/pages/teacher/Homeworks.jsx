import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';

function Homeworks() {
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHomeworks();
  }, []);

  const fetchHomeworks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/homeworks/teacher');
      setHomeworks(response.data);
    } catch (error) {
      console.error('Error fetching homeworks:', error);
      setError('Failed to fetch homeworks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Homework Assignments</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {homeworks.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No homework assignments found.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {homeworks.map((homework) => (
              <div key={homework._id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {homework.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {homework.description}
                    </p>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Course: {homework.courseName}</p>
                      <p>Due Date: {new Date(homework.dueDate).toLocaleString()}</p>
                      <p>Assigned To: {homework.assignedTo?.name || 'Student'}</p>
                      <p>Status: {homework.status}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {homework.grade !== undefined && (
                      <p>Grade: {homework.grade}%</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Homeworks; 