import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-hot-toast';
import { FiHome, FiUser, FiCalendar, FiClipboard, FiBookOpen, FiHelpCircle } from 'react-icons/fi';

function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Sample upcoming classes and notifications
  const [upcomingClasses] = useState([
    {
      id: 1,
      title: 'Advanced Mathematics',
      course: 'MTH301',
      startTime: '10:00 AM',
      endTime: '11:30 AM',
      room: '301',
      students: 24
    },
    {
      id: 2,
      title: 'Introduction to Physics',
      course: 'PHY101',
      startTime: '1:00 PM',
      endTime: '2:30 PM',
      room: '205',
      students: 32
    }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First attempt to get data from localStorage for immediate display
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            
            if (userData.teacherProfile) {
              setProfile(userData.teacherProfile);
            }
          } catch (e) {
            console.error('Error parsing localStorage user data:', e);
          }
        }
        
        // Then fetch the latest data from API
        try {
          const userRes = await axios.get('/auth/me');
          if (userRes.data) {
            setUser(userRes.data);
            localStorage.setItem('user', JSON.stringify(userRes.data));
            console.log('User data:', userRes.data);
          }
        } catch (userErr) {
          console.error('Error fetching user data:', userErr);
        }

        try {
          const profileRes = await axios.get('/profile/teacher');
          if (profileRes.data) {
            setProfile(profileRes.data);
            console.log('Profile data:', profileRes.data);
          }
        } catch (profileErr) {
          console.error('Error fetching profile data:', profileErr);
          // If profile API fails but we have profile data in user object, use that
          if (user?.teacherProfile) {
            setProfile(user.teacherProfile);
          }
        }
      } catch (err) {
        console.error('Error in overall fetch operation:', err);
        
        // If API calls fail, we already have data from localStorage if available
        if (!user && !profile) {
          toast.error('Failed to load profile data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to get the avatar URL
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '';
    
    if (avatarPath.startsWith('http')) {
      // Already a full URL
      return avatarPath;
    } else if (avatarPath.startsWith('/uploads')) {
      // Direct server path
      return `http://localhost:5000${avatarPath}`;
    } else {
      // Fallback
      return `${axios.defaults.baseURL}${avatarPath}`;
    }
  };

  const navigationItems = [
    { icon: <FiHome className="w-5 h-5" />, text: 'Dashboard', path: '/teacher-dashboard' },
    { icon: <FiUser className="w-5 h-5" />, text: 'Profile', path: '/teacher-profile' },
    { icon: <FiClipboard className="w-5 h-5" />, text: 'Attendance', path: '/teacher-dashboard/attendance' },
    { icon: <FiBookOpen className="w-5 h-5" />, text: 'Homework', path: '/teacher-dashboard/homework' },
    { icon: <FiCalendar className="w-5 h-5" />, text: 'Schedules', path: '/teacher-dashboard/schedules' },
    { icon: <FiCalendar className="w-5 h-5" />, text: 'Leave Application', path: '/teacher-dashboard/holidays' },
    { icon: <FiHelpCircle className="w-5 h-5" />, text: 'Need Support', path: '/teacher-dashboard/support' },
  ];

  // Check if we have avatar and user data
  const hasAvatar = profile?.avatar || user?.teacherProfile?.avatar;
  const userName = user?.name || profile?.name || '';
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading dashboard...</div>;
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <Link to="/teacher-profile" className="block">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                {hasAvatar ? (
                  <img 
                    src={getAvatarUrl(profile?.avatar || user?.teacherProfile?.avatar)} 
                    alt={userName} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = ''; // Reset to empty
                      console.error('Failed to load avatar');
                    }}
                  />
                ) : (
                  userName.charAt(0) || 'T'
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{userName || 'Loading...'}</h3>
                <p className="text-sm text-gray-500">Teacher</p>
              </div>
            </div>
          </Link>
        </div>
        <nav className="mt-6 px-4">
          {navigationItems.map((item) => (
            <Link
              key={item.text}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors duration-150 ${
                location.pathname === item.path
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {userName || 'Teacher'}!</h1>
          <p className="text-gray-600">Here's your teaching overview for today.</p>
        </div>

        {/* Profile Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Department</h3>
            <p className="mt-2 text-lg font-semibold text-gray-800">
              {profile?.department || user?.teacherProfile?.department || 'Not Set'}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Courses Teaching</h3>
            <p className="mt-2 text-lg font-semibold text-gray-800">
              {(profile?.courses?.length || user?.teacherProfile?.courses?.length || 0)} Courses
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Experience</h3>
            <p className="mt-2 text-lg font-semibold text-gray-800">
              {profile?.experience || user?.teacherProfile?.experience || 0} Years
            </p>
          </div>
        </div>

        {/* Today's Classes Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Classes</h2>
          <div className="space-y-4">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <span className="block text-sm font-semibold text-purple-600">{classItem.startTime}</span>
                    <span className="block text-xs text-gray-500">{classItem.endTime}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{classItem.title}</h3>
                    <p className="text-sm text-gray-500">Course: {classItem.course} | Room: {classItem.room} | Students: {classItem.students}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Outlet Section */}
        <Outlet />
      </div>
    </div>
  );
}

export default TeacherDashboard;