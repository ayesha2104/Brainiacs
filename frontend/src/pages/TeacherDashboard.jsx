import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';


function TeacherDashboard() {
  const [activeCard, setActiveCard] = useState('');

  const sidebarCards = [
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
        <div className="p-4">
          <h2 className="text-xl font-bold text-purple-600 mb-6">Teacher Dashboard</h2>
          <nav className="space-y-2">
            {sidebarCards.map((card) => (
              <Link
                key={card.id}
                to={card.path}
                onClick={() => setActiveCard(card.id)}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  activeCard === card.id
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
      {/* <DotLottieReact
      src="https://lottie.host/f1596e18-b68c-4606-87f7-2e47260967ee/5ZrHXpSDre.lottie"
      loop
      autoplay
    /> */}
        <Outlet />
      </div>
    </div>
  );
}

export default TeacherDashboard; 