const bcrypt = require('bcrypt');
const prisma = require('../prismaClient');
const { generateToken } = require('../utils/jwt');

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
        res.json({
            user: { id: user.id, username: user.username },
            token
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid password' });

    const token = generateToken(user);
    res.json({ 
        user: { id: user.id, username: user.username },
        token 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { signup, login }