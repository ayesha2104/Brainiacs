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
      <Link to="/" className="text-2xl font-bold text-purple-600">Brainiacs</Link>
      <ul className="flex gap-6 items-center">
        {token ? (
          <>
            <li><Link to="/dashboard" className="text-gray-700 hover:text-purple-600 transition-colors">Dashboard</Link></li>
            <li><Link to="/courses" className="text-gray-700 hover:text-purple-600 transition-colors">Courses</Link></li>
            <li>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
