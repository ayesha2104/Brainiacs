import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Get the user role from localStorage
    if (token) {
      const role = localStorage.getItem('role');
      setUserRole(role);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleBrainiacsClick = (e) => {
    e.preventDefault();

    if (!token) {
      navigate('/');
      return;
    }

    if (userRole === 'student') {
      navigate('/student-dashboard');
    } else if (userRole === 'teacher') {
      navigate('/teacher-dashboard');
    } else {
      // Fallback if role is not properly set
      navigate('/login');
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-sm p-4 flex justify-between items-center">
      <a href="#" onClick={handleBrainiacsClick} className="text-2xl font-bold text-white">
        Brainiacs
      </a>
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