import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-purple-600">Brainiacs</h1>
      <ul className="flex gap-4">
        {token ? (
          <>
            <li><Link to="/dashboard" className="text-purple-600 hover:underline">Dashboard</Link></li>
            <li><button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="text-purple-600 hover:underline">Login</Link></li>
            <li><Link to="/signup" className="text-purple-600 hover:underline">Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
