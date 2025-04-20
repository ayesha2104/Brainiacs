import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Token will be like "Bearer eyJhbGciOi..."
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token. Access denied!' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded; // Store user info
    next(); // Let the user go to the route
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default authMiddleware;
