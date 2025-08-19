import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import PostCard from './PostCard';
import styles from '../styles/Thread.module.css';
import ui from '../styles/ui.module.css';
import { MAX_CONTENT } from '../utils/constants';
import { useAuth } from '../context/authContext';
import { useRouter } from 'next/router';

const Thread = ({ thread }) => {
    const { user, token } = useAuth();
    const router = useRouter();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

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

        setError('');
        setSubmitting(true);
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
            setError(err.response?.data?.error || 'Failed to post comment');
        } finally {
            setSubmitting(false);
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
                                <div className={styles.commentContent}>{comment.content}</div>

                                <div className={styles.commentActions}>
                                    <button className={ui.btnText} onClick={() => {
                                        setReplyingTo(replyingTo === comment.id ? null : comment.id);
                                        setReplyText('');
                                    }}>{replyingTo === comment.id ? 'Cancel' : 'Reply'}</button>
                                </div>

                                {/* replies (one level) */}
                                {comment.replies && comment.replies.length > 0 && (
                                    <div className={styles.replies}>
                                        {comment.replies.map(r => (
                                            <div key={r.id} className={styles.replyCard}>
                                                <div className={styles.replyMeta}>{r.author?.username || 'Anonymous'} • {new Date(r.createdAt).toLocaleString()}</div>
                                                <div className={styles.commentContent}>{r.content}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* reply composer */}
                                {replyingTo === comment.id && (
                                    <div className={styles.replyComposer}>
                                        <textarea
                                            className={styles.commentTextarea}
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder={user ? 'Write a reply…' : 'Sign in to reply'}
                                            disabled={!user}
                                            maxLength={500}
                                        />
                                        <div className={styles.composerActions}>
                                            {(() => {
                                                const remaining = Math.max(0, MAX_CONTENT - replyText.length);
                                                const warn = remaining <= 20;
                                                return (
                                                    <div className={warn ? `${styles.charCount} ${styles.charCountWarn}` : styles.charCount}>
                                                        {remaining} characters
                                                    </div>
                                                );
                                            })()}
                                            <button
                                                className={ui.btnPrimary}
                                                onClick={async () => {
                                                    if (!user) return router.push('/login');
                                                    const content = replyText.trim();
                                                    if (!content) return;
                                                    try {
                                                        const res = await axios.post(
                                                            `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${thread.id}/comments`,
                                                            { content, parentId: comment.id },
                                                            { withCredentials: true }
                                                        );
                                                        // append reply locally under the parent comment
                                                        setComments(prev => prev.map(c => c.id === comment.id ? { ...c, replies: [...(c.replies || []), res.data] } : c));
                                                        setReplyText('');
                                                        setReplyingTo(null);
                                                    } catch (err) {
                                                        console.error(err);
                                                    }
                                                }}
                                                disabled={!user || replyText.trim().length === 0}
                                            >
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Comment Form */}
            <div className={styles.addCommentForm}>
                <div className={styles.composerAvatar} aria-hidden>
                    {/* small avatar */}
                    <img
                        src={user?.avatar || 'https://placehold.co/40'}
                        alt="Your avatar"
                        className={styles.composerAvatarImg}
                    />
                </div>

                <div className={styles.composerBox}>
                    <label htmlFor={`comment-${thread.id}`} className={styles.srOnly}>Add a comment</label>
                    <textarea
                        id={`comment-${thread.id}`}
                        className={styles.commentTextarea}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={user ? "Share your thoughts..." : "Sign in to add a comment"}
                        disabled={!user || submitting}
                        aria-label="Add a comment"
                        maxLength={500}
                    />

                    <div className={styles.composerActions}>
                        {(() => {
                            const remaining = Math.max(0, MAX_CONTENT - newComment.length);
                            const warn = remaining <= 20;
                            return (
                                <div className={warn ? `${styles.charCount} ${styles.charCountWarn}` : styles.charCount}>
                                    {remaining} characters
                                </div>
                            );
                        })()}
                        <button
                            className={ui.btnPrimary}
                            onClick={handleAddComment}
                            disabled={!user || newComment.trim().length === 0 || submitting}
                            aria-disabled={!user || newComment.trim().length === 0 || submitting}
                        >
                            {submitting ? 'Posting…' : (user ? 'Post comment' : 'Sign in')}
                        </button>
                    </div>

                    {error && (
                        <div className={styles.inlineError} role="status" aria-live="polite">{error}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

Thread.propTypes = {
    thread: PropTypes.object.isRequired,
};

export default Thread;
