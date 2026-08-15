import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from '../../utils/axios';

function TeacherAttendance() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [myCourses, setMyCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [attendance, setAttendance] = useState({});
  const [studentsPresent, setStudentsPresent] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/courses?mine=true&limit=100');
        setMyCourses(res.data.data);
        if (res.data.data.length > 0) {
          setCourseId(res.data.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load your courses.');
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!courseId) {
      setStudents([]);
      return;
    }

    const fetchStudents = async () => {
      setLoadingStudents(true);
      setAttendance({});
      try {
        const res = await axios.get(`/courses/${courseId}/students`);
        setStudents(res.data);
      } catch (error) {
        console.error('Error fetching enrolled students:', error);
        toast.error('Failed to load enrolled students.');
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [courseId]);

  useEffect(() => {
    const presentCount = Object.values(attendance).filter(status => status === 'present').length;
    setStudentsPresent(presentCount);
  }, [attendance]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const records = students.map((student) => ({
        student: student._id,
        status: attendance[student._id] || 'absent',
      }));

      await axios.post('/attendance', { course: courseId, date, records });

      toast.success('Attendance recorded successfully!');
      setAttendance({});
    } catch (error) {
      console.error('Error recording attendance:', error);
      toast.error(error.response?.data?.message || 'Failed to record attendance. Please try again.');
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
        {myCourses.length === 0 ? (
          <p className="text-gray-500">You haven't created any courses yet. Create one from the Courses page first.</p>
        ) : (
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
              <label className="block text-sm font-medium text-gray-700">Course</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              >
                {myCourses.map((course) => (
                  <option key={course._id} value={course._id}>{course.title}</option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-gray-900">Student Attendance</h3>
                <div className="text-sm bg-purple-100 text-purple-800 py-1 px-3 rounded-full">
                  {studentsPresent} of {students.length} students present
                </div>
              </div>

              {loadingStudents ? (
                <p className="text-gray-500 text-sm">Loading enrolled students...</p>
              ) : students.length === 0 ? (
                <p className="text-gray-500 text-sm">No students are enrolled in this course yet.</p>
              ) : (
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
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-70"
              disabled={loading || students.length === 0}
            >
              {loading ? 'Saving...' : 'Save Attendance'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default TeacherAttendance;
