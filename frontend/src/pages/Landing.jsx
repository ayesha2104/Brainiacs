// src/pages/Landing.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';

// Import your Lottie animation JSON files
// You'll need to download these files and add them to your project
import studyAnimation from '../assets/study-animation.json';
import collaborationAnimation from '../assets/collaboration-animation.json';
import progressAnimation from '../assets/progress-animation.json';
import heroAnimation from '../assets/hero-animation.json';

function Landing() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden py-16">
        <div className="absolute opacity-20 right-0 top-0 w-full h-full">
          <div className="absolute right-0 top-0 w-full md:w-1/2 h-full">
            <Lottie animationData={heroAnimation} loop={true} />
          </div>
        </div>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 relative z-10">
          <div className="text-center md:text-left md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl font-extrabold mb-6 text-white drop-shadow-lg">
              Welcome to <span className="text-yellow-400">Brainiacs</span>
            </h1>
            <p className="text-lg mb-6 text-white opacity-80 max-w-lg">
              A collaborative study platform built for students who want to learn smarter, track progress, and grow together.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
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
          <div className="md:w-1/2 w-full max-w-md">
            <Lottie animationData={heroAnimation} loop={true} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-extrabold text-white mb-12">
            Features that will help you succeed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30 group hover:transform hover:scale-105">
              <div className="h-48 mb-4 overflow-hidden">
                <Lottie animationData={collaborationAnimation} loop={true} />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Collaborative Study</h3>
              <p className="text-white/90">
                Collaborate with like-minded students, share notes, and study together in real-time.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30 group hover:transform hover:scale-105">
              <div className="h-48 mb-4 overflow-hidden">
                <Lottie animationData={studyAnimation} loop={true} />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Track Progress</h3>
              <p className="text-white/90">
                Set goals, track your study progress, and celebrate your achievements.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30 group hover:transform hover:scale-105">
              <div className="h-48 mb-4 overflow-hidden">
                <Lottie animationData={progressAnimation} loop={true} />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Smart Notifications</h3>
              <p className="text-white/90">
                Get reminders and smart notifications to keep you on track with your study goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
            What Students Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">JS</div>
                <div className="ml-4">
                  <h4 className="font-bold">Jane Smith</h4>
                  <p className="text-sm text-gray-600">Computer Science Student</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Brainiacs has completely transformed how I study. The collaborative features make group projects so much easier!"
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">MT</div>
                <div className="ml-4">
                  <h4 className="font-bold">Michael Thompson</h4>
                  <p className="text-sm text-gray-600">Biology Major</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The progress tracking feature keeps me accountable and motivated. I've improved my grades significantly since I started using Brainiacs."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">AK</div>
                <div className="ml-4">
                  <h4 className="font-bold">Aisha Khan</h4>
                  <p className="text-sm text-gray-600">Engineering Student</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Smart notifications help me stay on top of my study schedule. I never miss an important deadline now!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to transform your study experience?</h2>
            <p className="mb-8 text-lg opacity-90">Join thousands of students who are already learning smarter with Brainiacs.</p>
            <Link to="/signup">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition duration-300 transform hover:scale-105">
                Get Started Today
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="font-bold text-xl">Brainiacs</p>
              <p className="text-sm mt-1">&copy; 2025 Brainiacs. All rights reserved.</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h4 className="font-semibold mb-2">Links</h4>
                <div className="flex gap-4">
                  <a href="#" className="text-white hover:text-blue-200 text-sm">Privacy Policy</a>
                  <a href="#" className="text-white hover:text-blue-200 text-sm">Terms of Service</a>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Connect with us</h4>
                <div className="flex gap-4">
                  <a href="#" className="text-white hover:text-blue-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-white hover:text-blue-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-white hover:text-blue-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-white hover:text-blue-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;