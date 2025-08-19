import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import styles from '../styles/PostCard.module.css';

const PostCard = ({ post }) => {
  const router = useRouter();
  const authorName = post.anonymous ? 'Anonymous' : post.author?.username || 'Unknown';
  const avatar = post.author?.avatar || 'https://placehold.co/40';
  const createdAt = post.createdAt ? new Date(post.createdAt) : null;

  const handleOpenThread = () => {
    router.push(`/thread/${post.id}`);
  };

  return (
    <article onClick={handleOpenThread} className={styles.card}>
      <div className={styles.header}>
        <img className={styles.avatar} src={avatar} alt={`${authorName} avatar`} />
        <div>
          <div className={styles.user}>{authorName}</div>
          <div className={styles.meta}>
            {post.city || 'Unknown city'}{createdAt ? ` • ${createdAt.toLocaleString()}` : ''}
          </div>
        </div>
      </div>

      <div className={styles.content}>{post.content}</div>

      {post.tags && post.tags.length > 0 && (
        <div className={styles.tags}>
          {post.tags.map((t) => (
            <span key={t} className={styles.tag}>#{t}</span>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.actions}>
          <button className={styles.actionBtn} aria-label="like">👍 {post.likes || 0}</button>
          <button className={styles.actionBtn} aria-label="comment">💬</button>
        </div>

        <div className={styles.meta}>{post.anonymous ? '' : post.author?.username || ''}</div>
      </div>
    </article>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    content: PropTypes.string.isRequired,
    city: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    anonymous: PropTypes.bool,
    author: PropTypes.shape({
      username: PropTypes.string,
      avatar: PropTypes.string,
    }),
    createdAt: PropTypes.string,
    likes: PropTypes.number,
  }).isRequired,
};

export default PostCard;
