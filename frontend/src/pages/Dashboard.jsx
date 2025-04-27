import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiClipboard, FiBarChart2, FiHelpCircle, FiBell, FiUser } from 'react-icons/fi';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const location = useLocation();
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
      try {
        // Try to get data from localStorage first for immediate display
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const localUserData = JSON.parse(storedUser);
            setUser(localUserData);
            if (localUserData.studentProfile) {
              setProfile(localUserData.studentProfile);
            }
          } catch (e) {
            console.error('Error parsing localStorage user data:', e);
          }
        }
        
        // Then fetch fresh data from the API
        try {
          // Get user data from API
          const userRes = await axios.get('/auth/me');
          if (userRes.data) {
            setUser(userRes.data);
          }
          
          // Get profile data from API
          const profileRes = await axios.get('/profile/student');
          if (profileRes.data) {
            setProfile(profileRes.data);
          }
        } catch (apiError) {
          console.error('API data fetch error:', apiError);
          // We already have localStorage data as fallback if available
        }
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
      }
    };

    fetchData();
  }, []);

  const navigationItems = [
    { icon: <FiHome className="w-5 h-5" />, text: 'Dashboard', path: '/student-dashboard' },
    { icon: <FiUser className="w-5 h-5" />, text: 'Profile', path: '/student-profile' },
    { icon: <FiBook className="w-5 h-5" />, text: 'Courses', path: '/student-courses' },
    { icon: <FiClipboard className="w-5 h-5" />, text: 'Homeworks', path: '/student-homeworks' },
    { icon: <FiBarChart2 className="w-5 h-5" />, text: 'Statistics', path: '/student-statistics' },
    { icon: <FiHelpCircle className="w-5 h-5" />, text: 'Need Support', path: '/student-support' },
  ];

  // Function to render the avatar with consistent logic between components
  const renderAvatar = () => {
    if (!profile?.avatar) {
      return user?.name?.charAt(0) || 'A';
    }

    // Create a proper URL for the image
    let avatarUrl;
    if (profile.avatar.startsWith('http')) {
      // Already a full URL
      avatarUrl = profile.avatar;
    } else if (profile.avatar.startsWith('/uploads')) {
      // Remove the baseURL and just use the path directly since we're accessing it from the frontend
      avatarUrl = `http://localhost:5000${profile.avatar}`;
    } else {
      // Fallback, use the baseURL
      avatarUrl = `${axios.defaults.baseURL}${profile.avatar}`;
    }

    return (
      <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" 
           onError={(e) => {
             e.target.onerror = null;
             e.target.style.display = 'none';
             console.error('Failed to load avatar:', avatarUrl);
           }} />
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <Link to="/student-profile" className="block">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                {profile?.avatar ? renderAvatar() : (user?.name?.charAt(0) || 'A')}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{user?.name || 'Loading...'}</h3>
                <p className="text-sm text-gray-500">Student</p>
              </div>
            </div>
          </Link>
        </div>
        <nav className="mt-6 px-4">
          {navigationItems.map((item) => (
            <Link
              key={item.text}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors duration-150 ${location.pathname === item.path
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              {item.icon}
              <span>{item.text}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name || 'Student'}!</h1>
          <p className="text-gray-600">Here's what's happening with your courses today.</p>
        </div>

        {/* Courses Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">{course.image}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{course.title}</h3>
                    <p className="text-sm text-gray-500">Instructor: {course.instructor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">Progress</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <span className="text-sm text-gray-500">Lessons</span>
                  <p className="font-semibold">{course.lessons}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Assignments</span>
                  <p className="font-semibold">{course.assignments}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Last Score</span>
                  <p className="font-semibold">{course.lastScore}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Time</span>
                  <p className="font-semibold">{course.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Exams Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Exams</h2>
          <div className="space-y-4">
            {exams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <span className="block text-sm font-semibold text-purple-600">{exam.date}</span>
                    <span className="block text-xs text-gray-500">{exam.time}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{exam.title}</h3>
                    <p className="text-sm text-gray-500">{exam.description}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;