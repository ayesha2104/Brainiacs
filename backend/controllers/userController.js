import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Create a new user profile
export async function createUser(req, res) {
  try {
    const { email, password, name, role } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'STUDENT'
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get user profile
export async function getUserProfile(req, res) {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        courses: {
          include: {
            course: true
          }
        },
        homework: true,
        assignedHomework: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Update user profile
export async function updateUserProfile(req, res) {
  try {
    const userId = req.params.id;
    const { name, email, role } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        role
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get all courses for a user
export async function getUserCourses(req, res) {
  try {
    const userId = req.params.id;
    const courses = await prisma.courseEnrollment.findMany({
      where: { userId },
      include: {
        course: true
      }
    });
    res.json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get all homework for a user
export async function getUserHomework(req, res) {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    let homework;
    if (user.role === 'TEACHER') {
      homework = await prisma.homework.findMany({
        where: { teacherId: userId },
        include: {
          course: true
        }
      });
    } else {
      homework = await prisma.homework.findMany({
        where: {
          course: {
            enrollments: {
              some: {
                userId: userId
              }
            }
          }
        },
        include: {
          course: true
        }
      });
    }

    res.json(homework);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
} 