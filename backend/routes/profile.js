import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect as auth } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/avatars';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// Get student profile
router.get('/student', auth, async (req, res) => {
    try {
        console.log('Fetching student profile for user:', req.user.id);

        const user = await User.findById(req.user.id)
            .select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'student') {
            return res.status(403).json({ message: 'User is not a student' });
        }

        if (!user.studentProfile) {
            // Create an empty profile if none exists
            user.studentProfile = {
                name: user.name || '',
                studentId: '',
                course: '',
                semester: '',
                degree: '',
                bio: '',
                interests: [],
                coursesCompleted: 0,
                studyHours: 0
            };
            await user.save();
        }

        console.log('Student profile retrieved:', user.studentProfile);
        res.json(user.studentProfile);
    } catch (err) {
        console.error('Profile fetch error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update student profile
router.put('/student', auth, async (req, res) => {
    try {
        console.log('Updating student profile for user:', req.user.id);
        console.log('Update data:', req.body);

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'student') {
            return res.status(403).json({ message: 'User is not a student' });
        }

        // Check if profile exists, create empty one if not
        if (!user.studentProfile) {
            user.studentProfile = {
                name: user.name || req.body.name || '',
                studentId: '',
                course: '',
                semester: '',
                degree: '',
                bio: '',
                interests: [],
                coursesCompleted: 0,
                studyHours: 0
            };
            await user.save();
            console.log('Created new profile for user');
        }

        // Get current profile data to preserve any fields not included in the update
        const currentProfile = user.studentProfile;

        let updatedProfileData;
        try {
            // Merge current profile with updates from request body
            updatedProfileData = {
                ...currentProfile.toObject(),
                ...req.body,
                // Ensure name is preserved if not in request
                name: req.body.name || currentProfile.name || user.name || '',
            };

            // Explicitly handle arrays
            if (req.body.interests) {
                updatedProfileData.interests = req.body.interests;
            }
        } catch (err) {
            console.error('Error preparing update data:', err);
            // If toObject() fails, use a different approach
            updatedProfileData = {
                name: req.body.name || currentProfile.name || user.name || '',
                studentId: req.body.studentId || currentProfile.studentId || '',
                semester: req.body.semester || currentProfile.semester || '',
                course: req.body.course || currentProfile.course || '',
                degree: req.body.degree || currentProfile.degree || '',
                bio: req.body.bio || currentProfile.bio || '',
                interests: req.body.interests || currentProfile.interests || [],
                coursesCompleted: req.body.coursesCompleted || currentProfile.coursesCompleted || 0,
                studyHours: req.body.studyHours || currentProfile.studyHours || 0,
                avatar: currentProfile.avatar || null
            };
        }

        console.log('Prepared update data:', updatedProfileData);

        // Update the profile
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { 'studentProfile': updatedProfileData } },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser || !updatedUser.studentProfile) {
            return res.status(400).json({ message: 'Failed to update profile' });
        }

        console.log('Profile updated successfully:', updatedUser.studentProfile);
        res.json(updatedUser.studentProfile);
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ message: 'Failed to update profile', error: err.message });
    }
});

// Upload student avatar
router.post('/student/avatar', auth, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'student') {
            // Delete uploaded file if user validation fails
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: 'Student not found' });
        }

        // Delete old avatar if it exists
        if (user.studentProfile?.avatar) {
            const oldAvatarPath = path.join('uploads/avatars', path.basename(user.studentProfile.avatar));
            if (fs.existsSync(oldAvatarPath)) {
                fs.unlinkSync(oldAvatarPath);
            }
        }

        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        await User.findByIdAndUpdate(req.user.id, {
            $set: { 'studentProfile.avatar': avatarUrl }
        });

        res.json({ avatar: avatarUrl });
    } catch (err) {
        // Delete uploaded file if any other error occurs
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: err.message });
    }
});

// Get teacher profile
router.get('/teacher', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password');

        if (!user || user.role !== 'teacher') {
            return res.status(404).json({ message: 'Teacher profile not found' });
        }

        res.json(user.teacherProfile || {});
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update teacher profile
router.put('/teacher', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'teacher') {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const updatedProfile = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    'teacherProfile': {
                        ...req.body,
                        email: user.email
                    }
                }
            },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(updatedProfile.teacherProfile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Upload teacher avatar
router.post('/teacher/avatar', auth, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'teacher') {
            // Delete uploaded file if user validation fails
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Delete old avatar if it exists
        if (user.teacherProfile?.avatar) {
            const oldAvatarPath = path.join('uploads/avatars', path.basename(user.teacherProfile.avatar));
            if (fs.existsSync(oldAvatarPath)) {
                fs.unlinkSync(oldAvatarPath);
            }
        }

        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        await User.findByIdAndUpdate(req.user.id, {
            $set: { 'teacherProfile.avatar': avatarUrl }
        });

        res.json({ avatar: avatarUrl });
    } catch (err) {
        // Delete uploaded file if any other error occurs
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: err.message });
    }
});

// Error handling middleware for multer
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File is too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ message: err.message });
    }
    next(err);
});

export default router; 