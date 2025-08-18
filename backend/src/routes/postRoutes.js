const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const prisma = new PrismaClient();

// Create a new post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content, tags, city, country, anonymous } = req.body;

    const post = await prisma.post.create({
      data: {
        content,
        tags: tags || [],
        city: city || null,
        country: country || null,
        anonymous: anonymous || false,
        authorId: anonymous ? null : req.user.id
      }
    });

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get posts, optionally filter by city/tag
router.get('/', async (req, res) => {
  const { city, tag } = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: city || undefined,
        tags: tag ? { has: tag } : undefined
      },
      orderBy: { createdAt: 'desc' },
      include: { author: true }
    });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

module.exports = router;
