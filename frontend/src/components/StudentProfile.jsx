import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from '../utils/axios';

function StudentProfile() {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        studentId: '',
        semester: '',
        course: '',
        degree: '',
        bio: '',
        interests: [],
        coursesCompleted: 0,
        studyHours: 0,
        avatar: null
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
            
            // First get the user data from API
            try {
                const userResponse = await axios.get('/auth/me');
                console.log('User data received from API:', userResponse.data);
                
                if (!userResponse.data) {
                    throw new Error('Failed to fetch user data from API');
                }
                
                // Save user data regardless of profile fetch success
                const userData = userResponse.data;
                
                try {
                    // Then get the profile data
                    const profileResponse = await axios.get('/profile/student');
                    console.log('Profile data received:', profileResponse.data);
                    
                    // Combine user data with profile data
                    const profileData = profileResponse.data || {};
                    
                    setProfile({
                        name: userData.name || profileData.name || '',
                        email: userData.email || '',
                        studentId: profileData.studentId || userData.studentProfile?.studentId || '',
                        semester: profileData.semester || userData.studentProfile?.semester || '',
                        course: profileData.course || userData.studentProfile?.course || '',
                        degree: profileData.degree || userData.studentProfile?.degree || '',
                        bio: profileData.bio || userData.studentProfile?.bio || '',
                        interests: profileData.interests || userData.studentProfile?.interests || [],
                        coursesCompleted: profileData.coursesCompleted || userData.studentProfile?.coursesCompleted || 0,
                        studyHours: profileData.studyHours || userData.studentProfile?.studyHours || 0,
                        avatar: profileData.avatar || userData.studentProfile?.avatar || null
                    });
                } catch (profileError) {
                    console.error('Profile API error:', profileError);
                    
                    // Fall back to user data if profile fetch fails
                    if (userData.studentProfile) {
                        const fallbackProfile = userData.studentProfile;
                        setProfile({
                            name: userData.name || '',
                            email: userData.email || '',
                            studentId: fallbackProfile.studentId || '',
                            semester: fallbackProfile.semester || '',
                            course: fallbackProfile.course || '',
                            degree: fallbackProfile.degree || '',
                            bio: fallbackProfile.bio || '',
                            interests: fallbackProfile.interests || [],
                            coursesCompleted: fallbackProfile.coursesCompleted || 0,
                            studyHours: fallbackProfile.studyHours || 0,
                            avatar: fallbackProfile.avatar || null
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
                        studentId: localUserData.studentProfile?.studentId || '',
                        semester: localUserData.studentProfile?.semester || '',
                        course: localUserData.studentProfile?.course || '',
                        degree: localUserData.studentProfile?.degree || '',
                        bio: localUserData.studentProfile?.bio || '',
                        interests: localUserData.studentProfile?.interests || [],
                        coursesCompleted: localUserData.studentProfile?.coursesCompleted || 0,
                        studyHours: localUserData.studentProfile?.studyHours || 0,
                        avatar: localUserData.studentProfile?.avatar || null
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
            const response = await axios.post('/profile/student/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log('Avatar upload complete, server response:', response.data);

            if (response.data && response.data.avatar) {
                // Dismiss loading toast
                toast.dismiss(loadingToast);
                
                const avatarPath = response.data.avatar;
                console.log('New avatar path:', avatarPath);
                
                setProfile(prev => ({ ...prev, avatar: avatarPath }));
                toast.success('Profile picture updated successfully');
                
                // Update user in localStorage if it exists
                try {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        const userData = JSON.parse(storedUser);
                        if (userData.studentProfile) {
                            userData.studentProfile.avatar = avatarPath;
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
            const updateData = {
                name: profile.name,
                studentId: profile.studentId,
                semester: profile.semester,
                course: profile.course,
                degree: profile.degree,
                bio: profile.bio,
                interests: profile.interests || []
            };

            console.log('Sending profile update with data:', updateData);
            const response = await axios.put('/profile/student', updateData);

            if (response.data) {
                console.log('Profile update response:', response.data);
                toast.success('Profile updated successfully');
                setIsEditing(false);

                // Update user in localStorage if it exists
                try {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        const userData = JSON.parse(storedUser);
                        userData.name = profile.name; // Update the name in the user object
                        if (!userData.studentProfile) {
                            userData.studentProfile = {};
                        }
                        userData.studentProfile = {...userData.studentProfile, ...response.data};
                        localStorage.setItem('user', JSON.stringify(userData));
                        console.log('Updated user in localStorage');
                    }
                } catch (e) {
                    console.error('Error updating localStorage:', e);
                }

                setTimeout(() => {
                    fetchProfile();
                }, 500);
            }
        } catch (error) {
            console.error('Profile update error:', error);
            if (error.response?.status === 404) {
                toast.error('Profile not found. Please log out and log in again.');
            } else {
                toast.error('Failed to update profile. Please try again.');
            }
        }
    };

    const renderAvatar = () => {
        if (!profile.avatar) {
            return <span className="text-4xl">{profile.name?.charAt(0)}</span>;
        }

        // Create a proper URL for the image
        // This will handle paths that are returned from the backend like "/uploads/avatars/filename.jpg"
        let avatarUrl;
        if (profile.avatar.startsWith('http')) {
            // Already a full URL
            avatarUrl = profile.avatar;
        } else if (profile.avatar.startsWith('/uploads')) {
            // Remove the baseURL and just use the path directly since we're accessing it from the frontend
            avatarUrl = `http://localhost:5000${profile.avatar}`;
        } else {
            // Fallback, use the baseURL
            avatarUrl = `${axios.defaults.baseURL}${profile.avatar}`;
        }

        console.log('Rendering avatar with URL:', avatarUrl);

        return (
            <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = ''; // Reset to empty
                    console.error('Failed to load avatar:', avatarUrl);
                }}
            />
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Student Profile</h2>
                    <button
                        type="button"
                        onClick={() => {
                            console.log('Edit button clicked, current state:', isEditing);
                            setIsEditing(!isEditing);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                {isEditing ? (
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="flex items-center justify-center mb-6 relative">
                            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {renderAvatar()}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full cursor-pointer">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <label className="block text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    className="w-full p-2 border rounded bg-gray-100"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Student ID</label>
                                <input
                                    type="text"
                                    value={profile.studentId}
                                    onChange={(e) => setProfile({ ...profile, studentId: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Semester</label>
                                <input
                                    type="text"
                                    value={profile.semester}
                                    onChange={(e) => setProfile({ ...profile, semester: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Course</label>
                                <input
                                    type="text"
                                    value={profile.course}
                                    onChange={(e) => setProfile({ ...profile, course: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Degree</label>
                                <input
                                    type="text"
                                    value={profile.degree}
                                    onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Bio</label>
                            <textarea
                                value={profile.bio || ''}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                className="w-full p-2 border rounded"
                                rows="4"
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Interests (comma-separated)</label>
                            <input
                                type="text"
                                value={profile.interests?.join(', ') || ''}
                                onChange={(e) => setProfile({ ...profile, interests: e.target.value.split(',').map(i => i.trim()) })}
                                className="w-full p-2 border rounded"
                                placeholder="e.g., Programming, AI, Web Development"
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
                    <div className="space-y-6">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {renderAvatar()}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-700">Name</h3>
                                <p className="mt-1">{profile.name}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700">Email</h3>
                                <p className="mt-1">{profile.email}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700">Student ID</h3>
                                <p className="mt-1">{profile.studentId}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700">Semester</h3>
                                <p className="mt-1">{profile.semester}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700">Course</h3>
                                <p className="mt-1">{profile.course}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700">Degree</h3>
                                <p className="mt-1">{profile.degree}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-700">Bio</h3>
                            <p className="mt-1">{profile.bio || 'No bio provided'}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-700">Interests</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {profile.interests && profile.interests.length > 0 ? (
                                    profile.interests.map((interest, index) => (
                                        <span
                                            key={index}
                                            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            {interest}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No interests added</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700">Courses Completed</h3>
                                <p className="mt-1 text-2xl font-bold text-purple-600">{profile.coursesCompleted}</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700">Study Hours</h3>
                                <p className="mt-1 text-2xl font-bold text-purple-600">{profile.studyHours}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentProfile;