import React, { useState } from 'react';
import axios from '../../utils/axios';

function TeacherAttendance() {
  const [date, setDate] = useState('');
  const [courseId, setCourseId] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/attendance', {
        date,
        courseId,
        attendance
      });
      if (response.data) {
        alert('Attendance recorded successfully!');
        setAttendance({});
      }
    } catch (error) {
      console.error('Error recording attendance:', error);
      alert('Failed to record attendance. Please try again.');
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Record Attendance</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Course ID</label>
            <input
              type="text"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Student Attendance</h3>
            <div className="space-y-2">
              {students.map(student => (
                <div key={student._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{student.name}</span>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`attendance-${student._id}`}
                        value="present"
                        checked={attendance[student._id] === 'present'}
                        onChange={() => handleAttendanceChange(student._id, 'present')}
                        className="form-radio text-purple-600"
                      />
                      <span className="ml-2">Present</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`attendance-${student._id}`}
                        value="absent"
                        checked={attendance[student._id] === 'absent'}
                        onChange={() => handleAttendanceChange(student._id, 'absent')}
                        className="form-radio text-purple-600"
                      />
                      <span className="ml-2">Absent</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
          >
            Save Attendance
          </button>
        </form>
      </div>
    </div>
  );
}

export default TeacherAttendance; 