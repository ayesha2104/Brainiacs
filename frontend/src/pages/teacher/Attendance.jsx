import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-hot-toast';

function TeacherAttendance() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [courseId, setCourseId] = useState('');
  const [students, setStudents] = useState([
    { _id: 'student1', name: 'John Doe' },
    { _id: 'student2', name: 'Jane Smith' },
    { _id: 'student3', name: 'Alex Johnson' },
    { _id: 'student4', name: 'Maria Garcia' },
    { _id: 'student5', name: 'Sam Wilson' }
  ]);
  const [attendance, setAttendance] = useState({});
  const [studentsPresent, setStudentsPresent] = useState(0);
  const [loading, setLoading] = useState(false);

  // Update students present count whenever attendance changes
  useEffect(() => {
    const presentCount = Object.values(attendance).filter(status => status === 'present').length;
    setStudentsPresent(presentCount);
  }, [attendance]);

  // Optional: Load courses from localStorage
  useEffect(() => {
    const storedSchedules = localStorage.getItem('teacherSchedules');
    if (storedSchedules) {
      try {
        const schedules = JSON.parse(storedSchedules);
        // If there are schedules, set the first course ID as default
        if (schedules.length > 0) {
          setCourseId(schedules[0].courseId);
        }
      } catch (error) {
        console.error('Error parsing stored schedules:', error);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create attendance record
      const attendanceRecord = {
        id: Date.now().toString(),
        date,
        courseId,
        attendance,
        studentsPresent,
        totalStudents: students.length,
        createdAt: new Date().toISOString(),
        teacher: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : 'Unknown Teacher'
      };
      
      // Get existing attendance records
      const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
      
      // Add new record
      existingRecords.push(attendanceRecord);
      
      // Save to localStorage
      localStorage.setItem('attendanceRecords', JSON.stringify(existingRecords));
      
      toast.success('Attendance recorded successfully!');
      
      // Reset form
      setAttendance({});
      
      // When the backend API is ready, use this code:
      /*
      const response = await axios.post('/api/teacher/attendance', {
        date,
        courseId,
        attendance,
        studentsPresent
      });
      
      if (response.data) {
        toast.success('Attendance recorded successfully!');
        setAttendance({});
      }
      */
    } catch (error) {
      console.error('Error recording attendance:', error);
      toast.error('Failed to record attendance. Please try again.');
    } finally {
      setLoading(false);
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
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900">Student Attendance</h3>
              <div className="text-sm bg-purple-100 text-purple-800 py-1 px-3 rounded-full">
                {studentsPresent} of {students.length} students present
              </div>
            </div>
            
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
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Attendance'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TeacherAttendance; 