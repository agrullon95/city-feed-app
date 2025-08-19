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

// Create a new comment for a post
router.post('/:postId/comments', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
  const { content, parentId } = req.body;

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(postId),
    authorId: req.user.id,
    parentId: parentId ? parseInt(parentId) : null,
      },
    });

    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Get comments for a post
router.get('/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await prisma.comment.findMany({
  where: { postId: parseInt(postId) },
  orderBy: { createdAt: 'asc' },
  include: { author: true, replies: { include: { author: true }, orderBy: { createdAt: 'asc' } } },
    });

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Get a single post by ID
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
      include: { author: true },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

module.exports = router;
