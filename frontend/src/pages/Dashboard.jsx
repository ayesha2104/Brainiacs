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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl text-center">
        <h1 className="text-3xl font-bold mb-4 text-purple-700">Welcome to Brainiacs 🎓</h1>
        {user ? (
          <p className="text-lg text-gray-700">Hello, <span className="font-semibold">{user.name}</span>!</p>
        ) : (
          <p className="text-lg text-gray-500">Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
