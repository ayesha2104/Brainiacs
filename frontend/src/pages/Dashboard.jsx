import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);

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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-2xl w-full transition-all duration-500 transform hover:scale-[1.02]">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-4">🎓 Welcome to Brainiacs</h1>
        <p className="text-lg text-gray-600 mb-6">
          A place to grow, collaborate, and learn smarter.
        </p>

        {user ? (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <p className="text-gray-700 text-xl">
              Hello, <span className="font-semibold text-purple-800">{user.name}</span> 👋
            </p>
            <p className="mt-2 text-sm text-gray-500">You're logged in and ready to explore!</p>
          </div>
        ) : (
          <p className="text-gray-500 text-md">Loading your dashboard...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
