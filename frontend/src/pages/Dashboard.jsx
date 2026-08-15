import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiClipboard, FiBarChart2, FiHelpCircle, FiBell, FiUser } from 'react-icons/fi';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [upcomingHomeworks, setUpcomingHomeworks] = useState([]);
  const location = useLocation();

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

        try {
          const coursesRes = await axios.get('/courses?enrolled=true&limit=4');
          setCourses(coursesRes.data.data || []);
        } catch (coursesError) {
          console.error('Courses fetch error:', coursesError);
        }

        try {
          const homeworksRes = await axios.get('/homeworks?status=pending&limit=3');
          setUpcomingHomeworks(homeworksRes.data.data || []);
        } catch (homeworksError) {
          console.error('Homeworks fetch error:', homeworksError);
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Courses</h2>
            <Link to="/student-courses" className="text-sm text-purple-600 hover:underline">Browse all courses</Link>
          </div>
          {courses.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-gray-500">
              You haven't enrolled in any courses yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div key={course._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">{course.title}</h3>
                      <p className="text-sm text-gray-500">Instructor: {course.instructor}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">Progress</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                          style={{ width: `${course.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{course.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Homeworks Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Homeworks</h2>
          {upcomingHomeworks.length === 0 ? (
            <div className="text-gray-500">No pending homework right now.</div>
          ) : (
            <div className="space-y-4">
              {upcomingHomeworks.map((hw) => (
                <div key={hw._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <span className="block text-sm font-semibold text-purple-600">
                        {new Date(hw.dueDate).toLocaleDateString('default', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{hw.title}</h3>
                      <p className="text-sm text-gray-500">{hw.courseName} — {hw.description}</p>
                    </div>
                  </div>
                  <Link
                    to="/student-homeworks"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;