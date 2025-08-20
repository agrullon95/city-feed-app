const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createPost = async (req, res) => {
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
};

const getPost = async (req, res) => {
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
};

const getPosts = async (req, res) => {
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
      include: { author: true, _count: { select: { comments: true } } },
    });

    // Calculate if there are more posts to load
    const hasMore = (parseInt(page) * parseInt(limit)) < totalCount;

    res.json({ posts, totalCount, hasMore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

const createPostComment = async (req, res) => {
  try {
    const { postId } = req.params;
      const { content, parentId } = req.body;
      const { validateParentComment } = require('../utils/commentUtils');

      try {
        const parsedParentId = await validateParentComment(prisma, parseInt(postId), parentId);

        const created = await prisma.comment.create({
          data: {
            content,
            postId: parseInt(postId),
            authorId: req.user.id,
            parentId: parsedParentId,
          },
        });

        const comment = await prisma.comment.findUnique({
          where: { id: created.id },
          include: { author: true, replies: { include: { author: true }, orderBy: { createdAt: 'asc' } } },
        });

        res.json(comment);
      } catch (err) {
        // validation errors return 400 with message
        return res.status(400).json({ error: err.message });
      }

    const created = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(postId),
        authorId: req.user.id,
        parentId: parsedParentId,
      },
    });

    const comment = await prisma.comment.findUnique({
      where: { id: created.id },
      include: { author: true, replies: { include: { author: true }, orderBy: { createdAt: 'asc' } } },
    });

    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

const getComments = async (req, res) => {
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
};

module.exports = { createPost, getPosts, createPostComment, getComments, getPost };
