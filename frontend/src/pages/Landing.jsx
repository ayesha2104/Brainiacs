// src/pages/Landing.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white h-screen flex items-center justify-center bg-cover bg-center">
        <div className="text-center px-6 md:px-12">
          <h1 className="text-5xl font-extrabold mb-6 text-white drop-shadow-lg">
            Welcome to <span className="text-yellow-400">Brainiacs</span>
          </h1>
          <p className="text-lg mb-6 text-white opacity-80">
            A collaborative study platform built for students who want to learn smarter, track progress, and grow together.
          </p>
          <div className="flex justify-center gap-6">
            <Link to="/signup">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-8 py-3 rounded-full text-lg font-semibold transition duration-300 transform hover:scale-105">
                Get Started
              </button>
            </Link>
            <Link to="/login">
              <button className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-800 text-white px-8 py-3 rounded-full text-lg font-semibold transition duration-300 transform hover:scale-105">
                Login
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-8">
            Features that will help you succeed
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Collaborative Study</h3>
              <p className="text-gray-600">
                Collaborate with like-minded students, share notes, and study together in real-time.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Track Progress</h3>
              <p className="text-gray-600">
                Set goals, track your study progress, and celebrate your achievements.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Smart Notifications</h3>
              <p className="text-gray-600">
                Get reminders and smart notifications to keep you on track with your study goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm">&copy; 2025 Brainiacs. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="text-white hover:text-yellow-400">Privacy Policy</a>
            <a href="#" className="text-white hover:text-yellow-400">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
