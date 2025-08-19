import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import PostCard from './PostCard';
import styles from '../styles/Thread.module.css';
import { useAuth } from '../context/authContext';
import { useRouter } from 'next/router';

const Thread = ({ thread }) => {
    const { user, token } = useAuth();
    const router = useRouter();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${thread.id}/comments`);
                setComments(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchComments();
    }, [thread.id]);

    const handleAddComment = async () => {
        if (!user) {
            // If user is not authenticated, send them to login
            router.push('/login');
            return;
        }

        const content = newComment.trim();
        if (!content) return;

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${thread.id}/comments`,
                { content },
                { withCredentials: true }
            );
            setComments(prev => [...prev, res.data]);
            setNewComment('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.threadContainer}>
            {/* Thread Header */}
            <div className={styles.threadHeader}>
                <PostCard post={thread} />
            </div>

            {/* Comments Section */}
            <div className={styles.commentsSection}>
                <h2>Comments</h2>
                {comments.length === 0 ? (
                    <p>No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className={styles.commentCard}>
                            <div className={styles.commentAvatar} />
                            <div className={styles.commentBody}>
                                <div className={styles.commentMeta}>
                                    {comment.author?.username || 'Anonymous'} • {new Date(comment.createdAt).toLocaleString()}
                                </div>
                                <div>{comment.content}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Comment Form */}
            <div className={styles.addCommentForm}>
                <textarea
                    className={styles.commentInput}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={user ? "Write a comment..." : "Sign in to add a comment"}
                    disabled={!user}
                    aria-label="Add a comment"
                />
                <button
                    className={styles.submitButton}
                    onClick={handleAddComment}
                    disabled={!user || newComment.trim().length === 0}
                >
                    {user ? 'Submit' : 'Sign in'}
                </button>
            </div>
        </div>
    );
};

Thread.propTypes = {
    thread: PropTypes.object.isRequired,
};

export default Thread;
