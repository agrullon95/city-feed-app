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
  const { city, tags, page = 1, limit = 20 } = req.query;

  try {
    const tagArray = tags ? tags.split(',') : undefined;

    // Fetch total count of posts for pagination metadata
    const totalCount = await prisma.post.count({
      where: {
        city: city || undefined,
        tags: tagArray ? { hasSome: tagArray } : undefined,
      },
    });

    const posts = await prisma.post.findMany({
      where: {
        city: city || undefined,
        tags: tagArray ? { hasSome: tagArray } : undefined,
      },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      include: { author: true },
    });

    // Calculate if there are more posts to load
    const hasMore = (parseInt(page) * parseInt(limit)) < totalCount;

    res.json({ posts, totalCount, hasMore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

module.exports = router;
