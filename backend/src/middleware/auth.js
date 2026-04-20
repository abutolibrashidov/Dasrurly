
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set');
  process.exit(1);  // Hard stop — never allow fallback
}

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  // Handle both authorize('kitchen', 'manager') and authorize(['kitchen', 'manager'])
  const allowed = roles.flat();
  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};
