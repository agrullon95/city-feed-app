import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import PostCard from './PostCard';
import styles from '../styles/Thread.module.css';

const Thread = ({ thread }) => {
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
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${thread.id}/comments`, {
                content: newComment,
            });
            setComments(prev => [...prev, res.data]);
            setNewComment('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.container}>
            <PostCard post={thread} />
            <div className={styles.commentsSection}>
                <h2>Comments</h2>
                {comments.length === 0 ? (
                    <p>No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className={styles.comment}>
                            <p><strong>{comment.authorName}</strong>: {comment.content}</p>
                        </div>
                    ))
                )}
                <div className={styles.addCommentSection}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                    />
                    <button onClick={handleAddComment}>Add Comment</button>
                </div>
            </div>
        </div>
    );
};

Thread.propTypes = {
    thread: PropTypes.object.isRequired,
};

export default Thread;
