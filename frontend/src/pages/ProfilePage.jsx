import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [homework, setHomework] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const [profileRes, coursesRes, homeworkRes] = await Promise.all([
        axios.get(`/api/users/profile/${user.id}`),
        axios.get(`/api/users/${user.id}/courses`),
        axios.get(`/api/users/${user.id}/homework`)
      ]);

      setProfile(profileRes.data);
      setCourses(coursesRes.data);
      setHomework(homeworkRes.data);
      setFormData({
        name: profileRes.data.name,
        email: profileRes.data.email
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/users/profile/${user.id}`, formData);
      setProfile(res.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!profile) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="text-xl">{profile.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="text-xl">{profile.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Role</p>
              <p className="text-xl capitalize">{profile.role.toLowerCase()}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">My Courses</h2>
          {courses.length > 0 ? (
            <div className="space-y-4">
              {courses.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="border rounded p-4 hover:bg-gray-50"
                >
                  <h3 className="text-xl font-semibold">{enrollment.course.title}</h3>
                  <p className="text-gray-600">{enrollment.course.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No courses enrolled</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            {profile.role === 'TEACHER' ? 'Assigned Homework' : 'My Homework'}
          </h2>
          {homework.length > 0 ? (
            <div className="space-y-4">
              {homework.map((hw) => (
                <div key={hw.id} className="border rounded p-4 hover:bg-gray-50">
                  <h3 className="text-xl font-semibold">{hw.title}</h3>
                  <p className="text-gray-600">{hw.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Due: {new Date(hw.dueDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No homework {profile.role === 'TEACHER' ? 'assigned' : 'due'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 