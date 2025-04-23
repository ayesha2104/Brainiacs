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
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-sm p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-white">Brainiacs</Link>
      <ul className="flex gap-6 items-center">
        {token ? (
          <>
            <li>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
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
                className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="px-4 py-2 bg-white text-purple-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;