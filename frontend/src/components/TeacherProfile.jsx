import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

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
            const response = await fetch('/api/profile/teacher', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setProfile(data || {});
            } else {
                toast.error(data.message || 'Failed to fetch profile');
            }
        } catch {
            toast.error('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);
        setUploading(true);

        try {
            const response = await fetch('/api/profile/teacher/avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });
            const data = await response.json();

            if (response.ok) {
                setProfile(prev => ({ ...prev, avatar: data.avatar }));
                toast.success('Avatar updated successfully');
            } else {
                toast.error(data.message || 'Failed to upload avatar');
            }
        } catch {
            toast.error('Failed to upload avatar');
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/profile/teacher', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(profile)
            });
            const data = await response.json();

            if (response.ok) {
                toast.success('Profile updated successfully');
                setIsEditing(false);
            } else {
                toast.error(data.message || 'Failed to update profile');
            }
        } catch {
            toast.error('Failed to update profile');
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
                        onClick={() => setIsEditing(!isEditing)}
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
                                        <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
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
                                    <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
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