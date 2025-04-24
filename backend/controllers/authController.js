import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const signupUser = async (req, res) => {
  try {
    const {
      email,
      password,
      role,
      name,
      // Student specific fields
      studentId,
      course,
      semester,
      degree,
      // Teacher specific fields
      teacherId,
      department,
      specialization,
      qualifications,
      experience
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object with role-specific profile
    const userData = {
      email,
      password: hashedPassword,
      role
    };

    // Add role-specific profile data
    if (role === 'student') {
      userData.studentProfile = {
        name,
        studentId,
        course,
        semester,
        degree,
        bio: '',
        interests: [],
        coursesCompleted: 0,
        studyHours: 0
      };
    } else if (role === 'teacher') {
      userData.teacherProfile = {
        name,
        teacherId,
        department,
        specialization,
        qualifications: qualifications || [],
        experience: experience || 0,
        bio: '',
        courses: []
      };
    }

    // Create new user
    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return success with token and user data (excluding password)
    const userResponse = {
      _id: user._id,
      email: user.email,
      role: user.role,
      profile: role === 'student' ? user.studentProfile : user.teacherProfile
    };

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed. Please try again.' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return success with token and user data (excluding password)
    const userResponse = {
      _id: user._id,
      email: user.email,
      role: user.role,
      profile: user.role === 'student' ? user.studentProfile : user.teacherProfile
    };

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};
