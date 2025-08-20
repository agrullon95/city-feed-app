const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createPost, getPosts, createPostComment, getComments, getPost } = require('../controllers/postController');

const router = express.Router();

// Create a new post
router.post('/', authMiddleware, createPost);

// Get posts, optionally filter by city/tag
router.get('/', authMiddleware, getPosts);

// Create a new comment for a post
router.post('/:postId/comments', authMiddleware, createPostComment);

// Get comments for a post
router.get('/:postId/comments', authMiddleware, getComments);

// Get a single post by ID
router.get('/:postId', authMiddleware, getPost);

module.exports = router;
