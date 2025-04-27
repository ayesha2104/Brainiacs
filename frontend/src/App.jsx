import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherHomework from './pages/teacher/Homework';
import TeacherAttendance from './pages/teacher/Attendance';
import TeacherHolidays from './pages/teacher/Holidays';
import TeacherSchedules from './pages/teacher/Schedules';
import TeacherSupport from './pages/teacher/Support';
import TeacherProfile from './components/TeacherProfile';
import StudentProfile from './components/StudentProfile';
import Courses from './pages/Courses';
import Homeworks from './pages/Homeworks';
import Statistics from './pages/Statistics';
import Support from './pages/Support';
import Landing from './pages/Landing';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes for students */}
            <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={['student']}><Dashboard /></ProtectedRoute>} />
            <Route path="/student-profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />
            <Route path="/student-courses" element={<ProtectedRoute allowedRoles={['student']}><Courses /></ProtectedRoute>} />
            <Route path="/student-homeworks" element={<ProtectedRoute allowedRoles={['student']}><Homeworks /></ProtectedRoute>} />
            <Route path="/student-statistics" element={<ProtectedRoute allowedRoles={['student']}><Statistics /></ProtectedRoute>} />
            <Route path="/student-support" element={<ProtectedRoute allowedRoles={['student']}><Support /></ProtectedRoute>} />

            {/* Protected routes for teachers */}
            <Route path="/teacher-dashboard" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/teacher-profile" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherProfile /></ProtectedRoute>} />
            <Route path="/teacher-dashboard/homework" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherHomework /></ProtectedRoute>} />
            <Route path="/teacher-dashboard/attendance" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherAttendance /></ProtectedRoute>} />
            <Route path="/teacher-dashboard/holidays" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherHolidays /></ProtectedRoute>} />
            <Route path="/teacher-dashboard/schedules" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherSchedules /></ProtectedRoute>} />
            <Route path="/teacher-dashboard/support" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherSupport /></ProtectedRoute>} />
          </Routes>
        </main>
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#333333',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              padding: '12px 20px',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
