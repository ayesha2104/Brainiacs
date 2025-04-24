import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import axios from '../utils/axios';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function TeacherDashboard() {
  const [activeCard, setActiveCard] = useState('');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, profileRes] = await Promise.all([
          axios.get('/user/dashboard'),
          axios.get('/api/profile/teacher')
        ]);
        setUser(userRes.data);
        setProfile(profileRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const sidebarCards = [
    { id: 'profile', title: 'Profile', icon: '👤', path: '/teacher-profile' },
    { id: 'attendance', title: 'Attendance', icon: '📋', path: '/teacher-dashboard/attendance' },
    { id: 'homework', title: 'Homework', icon: '📚', path: '/teacher-dashboard/homework' },
    { id: 'holidays', title: 'Holidays', icon: '🎉', path: '/teacher-dashboard/holidays' },
    { id: 'schedules', title: 'Class Schedules', icon: '⏰', path: '/teacher-dashboard/schedules' },
    { id: 'support', title: 'Need Support', icon: '❓', path: '/teacher-dashboard/support' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <Link to="/teacher-profile" className="block">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || 'T'
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{user?.name || 'Loading...'}</h3>
                <p className="text-sm text-gray-500">Teacher</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="p-4">
          <nav className="space-y-2">
            {sidebarCards.map((card) => (
              <Link
                key={card.id}
                to={card.path}
                onClick={() => setActiveCard(card.id)}
                className={`flex items-center p-3 rounded-lg transition-colors ${activeCard === card.id
                    ? 'bg-purple-100 text-purple-600'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <span className="text-xl mr-3">{card.icon}</span>
                <span className="font-medium">{card.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Profile Summary Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Profile Summary</h2>
            <Link
              to="/teacher-profile"
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              View Full Profile
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Department</h3>
              <p className="mt-2 text-lg font-semibold text-gray-800">
                {profile?.department || 'Not Set'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Courses Teaching</h3>
              <p className="mt-2 text-lg font-semibold text-gray-800">
                {profile?.courses?.length || 0} Courses
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Experience</h3>
              <p className="mt-2 text-lg font-semibold text-gray-800">
                {profile?.experience || 0} Years
              </p>
            </div>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default TeacherDashboard; 