import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiHome, FiBook, FiClipboard, FiBarChart2, FiHelpCircle, FiBell } from 'react-icons/fi';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [courses] = useState([
    {
      id: 1,
      title: 'Modern and Contemporary 3D Design and Modeling',
      instructor: 'Oliver Smith',
      progress: 70,
      lessons: '7/10',
      assignments: '8/12',
      lastScore: 'A',
      time: '25h',
      image: '🏛️'
    },
    {
      id: 2,
      title: 'The University of Sydney Positive Psychology',
      instructor: 'James Johnson',
      progress: 50,
      lessons: '5/10',
      assignments: '4/8',
      lastScore: 'B',
      time: '32h',
      image: '🎯'
    }
  ]);

  const [exams] = useState([
    {
      id: 1,
      date: '10 AUGUST',
      title: 'Psychological First Aid',
      description: 'Learn to provide psychological first aid to people in...',
      time: '03:00 PM'
    },
    {
      id: 2,
      date: '8 JUNE',
      title: 'Graphic Design',
      description: 'The goal of this specialization is to equip learners with a set...',
      time: '11:00 AM'
    }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/user/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{user?.name || 'Loading...'}</h3>
              <p className="text-sm text-gray-500">Student</p>
            </div>
          </div>
        </div>
        <nav className="mt-6 px-4">
          {[
            { icon: <FiHome className="w-5 h-5" />, text: 'Dashboard', active: true },
            { icon: <FiBook className="w-5 h-5" />, text: 'Courses' },
            { icon: <FiClipboard className="w-5 h-5" />, text: 'Homeworks' },
            { icon: <FiBarChart2 className="w-5 h-5" />, text: 'Statistic' },
            { icon: <FiHelpCircle className="w-5 h-5" />, text: 'Need support' },
          ].map((item) => (
            <a
              key={item.text}
              href="#"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors duration-150 ${item.active
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              {item.icon}
              <span>{item.text}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-150">
              <FiBell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium hover:opacity-90 transition-opacity duration-150">
              Subscribe Now!
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-teal-400 to-teal-500 p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
            <div className="text-5xl font-bold mb-2 text-white">A-</div>
            <div className="text-lg text-teal-100">GPA</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="font-semibold mb-4 text-gray-800">Homeworks</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Completed: 80/120</span>
              <span className="text-teal-500 font-semibold">75%</span>
            </div>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: '75%' }} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="font-semibold mb-4 text-gray-800">Progress</h3>
            <div className="flex space-x-2">
              {[60, 20, 10, 5, 5].map((percent, i) => (
                <div key={i} className="flex-1">
                  <div className="h-24 bg-gray-200 rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${['bg-teal-500', 'bg-blue-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500'][i]
                        }`}
                      style={{ height: `${percent}%`, marginTop: `${100 - percent}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-2 text-center">{percent}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Courses</h2>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium hover:bg-yellow-200 transition-colors duration-150">
                In progress
              </button>
              <button className="text-gray-500 hover:text-gray-700 transition-colors duration-150">
                All courses
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl bg-gray-50 p-3 rounded-xl">{course.image}</div>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </button>
                </div>
                <h3 className="font-semibold mb-2 text-gray-800">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{course.instructor}</p>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-600">Lessons: <span className="font-medium">{course.lessons}</span></p>
                    <p className="text-gray-600">Last score: <span className="font-medium text-teal-500">{course.lastScore}</span></p>
                  </div>
                  <div>
                    <p className="text-gray-600">Assignment: <span className="font-medium">{course.assignments}</span></p>
                    <p className="text-gray-600">Time: <span className="font-medium">{course.time}</span></p>
                  </div>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div className="text-xs font-semibold text-teal-600">
                      Progress
                    </div>
                    <div className="text-xs font-semibold text-teal-600">
                      {course.progress}%
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exams */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Exams</h2>
            <button className="text-gray-500 hover:text-gray-700 transition-colors duration-150">
              All exams
            </button>
          </div>
          <div className="space-y-4">
            {exams.map((exam) => (
              <div key={exam.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-sm font-medium text-purple-600">{exam.date.split(' ')[1]}</div>
                      <div className="text-2xl font-bold text-purple-700">{exam.date.split(' ')[0]}</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{exam.title}</h3>
                      <p className="text-sm text-gray-500">{exam.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-indigo-600">{exam.time}</div>
                    <button className="mt-2 px-4 py-1 text-sm text-indigo-600 border border-indigo-200 rounded-full hover:bg-indigo-50 transition-colors duration-150">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
