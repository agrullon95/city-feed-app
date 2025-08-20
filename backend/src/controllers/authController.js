const bcrypt = require('bcrypt');
const prisma = require('../prismaClient');
const { generateToken, verifyToken } = require('../utils/jwt');

const JWT_SECRET = process.env.JWT_SECRET;

// Signup
const signup = async (req, res) => {
  const { username, email, password, isAnon } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { 
        username,
        email,
        password: hashedPassword,
        isAnon
      },
    });

    const token = generateToken(user);

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      user: { id: user.id, username: user.username },
      token // optional for client-side storage
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid password' });

    const token = generateToken(user);

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    res.json({
      user: { id: user.id, username: user.username },
      token // optional for client-side storage
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Logout
const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

const me = async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.json({ user: null });

  try {
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true },
    });
    res.json({ user });
  } catch {
    res.json({ user: null });
  }
};

const updateMe = async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const decoded = verifyToken(token);
    const { username } = req.body;

    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: { username },
      select: { id: true, username: true, email: true },
    });

    res.json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { signup, login, logout, me, updateMe };