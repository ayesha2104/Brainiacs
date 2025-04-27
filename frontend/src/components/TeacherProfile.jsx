import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from '../utils/axios';

function TeacherProfile() {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        teacherId: '',
        department: '',
        specialization: '',
        qualifications: [],
        experience: '',
        bio: '',
        courses: [],
        avatar: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            
            // Try to get data from localStorage first
            const storedUser = localStorage.getItem('user');
            let localUserData = null;
            
            if (storedUser) {
                try {
                    localUserData = JSON.parse(storedUser);
                    console.log('User data from localStorage:', localUserData);
                } catch (e) {
                    console.error('Error parsing localStorage user data:', e);
                }
            }
            
            // Try fetching from API first
            try {
                // Get user data from auth endpoint
                const userResponse = await axios.get('/auth/me');
                console.log('User data received from API:', userResponse.data);
                
                if (!userResponse.data) {
                    throw new Error('Failed to fetch user data from API');
                }
                
                // Save user data
                const userData = userResponse.data;
                
                try {
                    // Get profile data from profile endpoint
                    const profileResponse = await axios.get('/profile/teacher');
                    console.log('Profile data received:', profileResponse.data);
                    
                    // Combine profile data
                    const profileData = profileResponse.data || {};
                    
                    setProfile({
                        name: userData.name || profileData.name || '',
                        email: userData.email || '',
                        teacherId: profileData.teacherId || userData.teacherProfile?.teacherId || '',
                        department: profileData.department || userData.teacherProfile?.department || '',
                        specialization: profileData.specialization || userData.teacherProfile?.specialization || '',
                        qualifications: profileData.qualifications || userData.teacherProfile?.qualifications || [],
                        experience: profileData.experience || userData.teacherProfile?.experience || '',
                        bio: profileData.bio || userData.teacherProfile?.bio || '',
                        courses: profileData.courses || userData.teacherProfile?.courses || [],
                        avatar: profileData.avatar || userData.teacherProfile?.avatar || '',
                    });
                } catch (profileError) {
                    console.error('Profile API error:', profileError);
                    
                    // Fall back to user data if profile fetch fails
                    if (userData.teacherProfile) {
                        setProfile({
                            name: userData.name || '',
                            email: userData.email || '',
                            teacherId: userData.teacherProfile.teacherId || '',
                            department: userData.teacherProfile.department || '',
                            specialization: userData.teacherProfile.specialization || '',
                            qualifications: userData.teacherProfile.qualifications || [],
                            experience: userData.teacherProfile.experience || '',
                            bio: userData.teacherProfile.bio || '',
                            courses: userData.teacherProfile.courses || [],
                            avatar: userData.teacherProfile.avatar || '',
                        });
                    } else {
                        throw new Error('No profile data available from API');
                    }
                }
            } catch (apiError) {
                console.error('API fetch error:', apiError);
                
                // Fall back to localStorage if API fails
                if (localUserData) {
                    console.log('Using localStorage data as fallback');
                    setProfile({
                        name: localUserData.name || '',
                        email: localUserData.email || '',
                        teacherId: localUserData.teacherProfile?.teacherId || '',
                        department: localUserData.teacherProfile?.department || '',
                        specialization: localUserData.teacherProfile?.specialization || '',
                        qualifications: localUserData.teacherProfile?.qualifications || [],
                        experience: localUserData.teacherProfile?.experience || '',
                        bio: localUserData.teacherProfile?.bio || '',
                        courses: localUserData.teacherProfile?.courses || [],
                        avatar: localUserData.teacherProfile?.avatar || '',
                    });
                } else {
                    toast.error('Failed to load profile. Please try logging in again.');
                }
            }
        } catch (error) {
            console.error('Profile fetch error:', error);
            toast.error('Failed to load profile. Please try logging in again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size should be less than 5MB');
            return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please upload a valid image file (JPEG, PNG, or GIF)');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);
        setUploading(true);
        
        // Show loading toast that will be dismissed when upload completes
        const loadingToast = toast.loading('Uploading profile picture...');

        try {
            const response = await axios.post('/profile/teacher/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log('Teacher avatar upload complete, server response:', response.data);

            if (response.data && response.data.avatar) {
                // Dismiss loading toast
                toast.dismiss(loadingToast);
                
                const avatarPath = response.data.avatar;
                console.log('New teacher avatar path:', avatarPath);
                
                setProfile(prev => ({ ...prev, avatar: avatarPath }));
                toast.success('Profile picture updated successfully');
                
                // Update user in localStorage if it exists
                try {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        const userData = JSON.parse(storedUser);
                        if (userData.teacherProfile) {
                            userData.teacherProfile.avatar = avatarPath;
                            localStorage.setItem('user', JSON.stringify(userData));
                            console.log('Updated avatar in localStorage');
                        }
                    }
                } catch (e) {
                    console.error('Error updating avatar in localStorage:', e);
                }
            }
        } catch (error) {
            console.error('Avatar upload error:', error);
            // Dismiss loading toast
            toast.dismiss(loadingToast);
            toast.error('Failed to upload profile picture. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('/profile/teacher', profile);
            console.log('Profile update response:', response.data);
            
            if (response.data) {
                toast.success('Profile updated successfully');
                setIsEditing(false);
                
                // Update user in localStorage if it exists
                try {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        const userData = JSON.parse(storedUser);
                        userData.teacherProfile = response.data;
                        localStorage.setItem('user', JSON.stringify(userData));
                        console.log('Updated user in localStorage');
                    }
                } catch (e) {
                    console.error('Error updating localStorage:', e);
                }
                
                // Refresh profile data
                setTimeout(() => {
                    fetchProfile();
                }, 500);
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    // Helper function to get the correct avatar URL
    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return '';
        
        if (avatarPath.startsWith('http')) {
            // Already a full URL
            return avatarPath;
        } else if (avatarPath.startsWith('/uploads')) {
            // Direct server path
            return `http://localhost:5000${avatarPath}`;
        } else {
            // Fallback
            return `${axios.defaults.baseURL}${avatarPath}`;
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Teacher Profile</h2>
                    <button
                        type="button"
                        onClick={() => {
                            console.log('Edit button clicked, current state:', isEditing);
                            setIsEditing(!isEditing);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                {isEditing ? (
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="flex items-center justify-center mb-6">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {profile.avatar ? (
                                        <img 
                                            src={getAvatarUrl(profile.avatar)}
                                            alt="Profile" 
                                            className="w-full h-full object-cover" 
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = ''; // Reset to empty
                                                console.error('Failed to load avatar:', profile.avatar);
                                            }}
                                        />
                                    ) : (
                                        <span className="text-4xl">{profile.name.charAt(0)}</span>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarUpload}
                                        disabled={uploading}
                                    />
                                    {uploading ? '...' : '📷'}
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Teacher ID</label>
                            <input
                                type="text"
                                value={profile.teacherId}
                                onChange={(e) => setProfile({ ...profile, teacherId: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Department</label>
                            <input
                                type="text"
                                value={profile.department}
                                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Specialization</label>
                            <input
                                type="text"
                                value={profile.specialization}
                                onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Qualifications (comma-separated)</label>
                            <input
                                type="text"
                                value={profile.qualifications.join(', ')}
                                onChange={(e) => setProfile({ ...profile, qualifications: e.target.value.split(',').map(q => q.trim()) })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Experience (years)</label>
                            <input
                                type="number"
                                value={profile.experience}
                                onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Bio</label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                className="w-full p-2 border rounded"
                                rows="4"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
                        >
                            Save Changes
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {profile.avatar ? (
                                    <img 
                                        src={getAvatarUrl(profile.avatar)}
                                        alt="Profile" 
                                        className="w-full h-full object-cover" 
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = ''; // Reset to empty
                                            console.error('Failed to load avatar:', profile.avatar);
                                        }}
                                    />
                                ) : (
                                    <span className="text-4xl">{profile.name.charAt(0)}</span>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold text-gray-700">Name</h3>
                                <p>{profile.name}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700">Email</h3>
                                <p>{profile.email}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700">Teacher ID</h3>
                                <p>{profile.teacherId}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700">Department</h3>
                                <p>{profile.department}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700">Specialization</h3>
                                <p>{profile.specialization}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700">Experience</h3>
                                <p>{profile.experience} years</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">Bio</h3>
                            <p className="mt-1">{profile.bio || 'No bio provided'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">Qualifications</h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {profile.qualifications.length > 0 ? (
                                    profile.qualifications.map((qualification, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            {qualification}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No qualifications added</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">Courses Teaching</h3>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                {profile.courses.length > 0 ? (
                                    profile.courses.map((course, index) => (
                                        <div key={index} className="bg-gray-50 p-3 rounded">
                                            <h4 className="font-medium">{course.title}</h4>
                                            <p className="text-sm text-gray-600">{course.schedule}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No courses assigned</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TeacherProfile; 