import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from '../../utils/axios';

function ScheduleCalendar() {
  const [schedules, setSchedules] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    course: '',
    day: '',
    startTime: '',
    endTime: '',
    room: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [];

  // Generate time slots from 8 AM to 8 PM
  for (let hour = 8; hour < 20; hour++) {
    const formattedHour = hour.toString().padStart(2, '0');
    timeSlots.push(`${formattedHour}:00`);
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [schedulesRes, coursesRes] = await Promise.all([
          axios.get('/schedules'),
          axios.get('/courses?mine=true&limit=100'),
        ]);
        setSchedules(schedulesRes.data);
        setMyCourses(coursesRes.data.data);
      } catch (error) {
        console.error('Error fetching schedule data:', error);
        toast.error('Failed to load schedule data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await axios.post('/schedules', formData);
      setSchedules((prev) => [...prev, response.data]);
      toast.success('Schedule added successfully!');
      setFormData({ course: '', day: '', startTime: '', endTime: '', room: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding schedule:', error);
      toast.error(error.response?.data?.message || 'Failed to add schedule. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setFormData(prev => ({ ...prev, day }));
    setShowForm(true);
  };

  const getSchedulesForDayAndTime = (day, time) => {
    return schedules.filter(schedule =>
      schedule.day === day &&
      schedule.startTime <= time &&
      schedule.endTime > time
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Class Schedule Calendar</h2>

      {loading ? (
        <div className="flex justify-center p-10">
          <p>Loading schedules...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Calendar Header */}
          <div className="grid grid-cols-8 bg-purple-600 text-white">
            <div className="p-3 border-r border-purple-500 font-medium">Time</div>
            {days.map(day => (
              <div
                key={day}
                className="p-3 border-r border-purple-500 font-medium cursor-pointer hover:bg-purple-700"
                onClick={() => handleDayClick(day)}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          {timeSlots.map(time => (
            <div key={time} className="grid grid-cols-8 border-b border-gray-200">
              <div className="p-2 border-r border-gray-200 bg-gray-50 font-medium text-sm">
                {time}
              </div>

              {days.map(day => {
                const daySchedules = getSchedulesForDayAndTime(day, time);
                return (
                  <div
                    key={`${day}-${time}`}
                    className="p-2 border-r border-gray-200 min-h-16 cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setSelectedDay(day);
                      setFormData(prev => ({
                        ...prev,
                        day,
                        startTime: time,
                        endTime: time.split(':')[0] < '19' ?
                          `${(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0')}:00` :
                          '20:00',
                      }));
                      setShowForm(true);
                    }}
                  >
                    {daySchedules.length > 0 ? (
                      daySchedules.map(schedule => (
                        <div
                          key={schedule._id}
                          className="text-xs bg-purple-100 p-1 mb-1 rounded border-l-4 border-purple-500"
                        >
                          <div className="font-bold">{schedule.course?.title}</div>
                          <div>{schedule.room}</div>
                        </div>
                      ))
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Add Schedule Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add Schedule for {selectedDay}</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Course</label>
                {myCourses.length === 0 ? (
                  <p className="text-sm text-gray-500 mt-1">
                    You haven't created any courses yet. Create one first from the Courses page.
                  </p>
                ) : (
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select a course</option>
                    {myCourses.map((course) => (
                      <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                  </select>
                )}
              </div>
              <input type="hidden" name="day" value={formData.day} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Room</label>
                <input
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || myCourses.length === 0}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-60"
                >
                  {saving ? 'Adding...' : 'Add Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScheduleCalendar;
