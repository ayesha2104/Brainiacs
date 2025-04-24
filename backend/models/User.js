import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({
  name: String,
  studentId: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  bio: String,
  interests: [String],
  avatar: String,
  coursesCompleted: {
    type: Number,
    default: 0
  },
  studyHours: {
    type: Number,
    default: 0
  }
});

const teacherProfileSchema = new mongoose.Schema({
  name: String,
  teacherId: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  qualifications: [String],
  experience: {
    type: Number,
    default: 0
  },
  bio: String,
  courses: [{
    title: String,
    schedule: String
  }],
  avatar: String
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    required: true
  },
  studentProfile: studentProfileSchema,
  teacherProfile: teacherProfileSchema,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for faster queries
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;
