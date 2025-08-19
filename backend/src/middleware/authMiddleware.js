const { verifyToken } = require('../utils/jwt');

const authGuard = (req, res, next) => {
  // read token from cookie instead of header
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authGuard;
