import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import styles from '../styles/PostCard.module.css';
import ui from '../styles/ui.module.css';

const PostCard = ({ post }) => {
  const router = useRouter();
  const authorName = post.anonymous ? 'Anonymous' : post.author?.username || 'Unknown';
  const avatar = post.author?.avatar || 'https://placehold.co/40';
  const createdAt = post.createdAt ? new Date(post.createdAt) : null;

  const isSingle = router.pathname === '/thread/[id]';

  const handleOpenThread = () => {
    router.push(`/thread/${post.id}`);
  };

  const WrapperProps = isSingle
    ? { className: styles.card }
    : {
      onClick: handleOpenThread,
      className: `${styles.card} ${styles.clickable}`,
      role: 'button',
      tabIndex: 0,
      onKeyDown: (e) => { if (e.key === 'Enter') handleOpenThread(); },
    };

  return (
    <article {...WrapperProps}>
      <div className={styles.header}>
        <img className={styles.avatar} src={avatar} alt={`${authorName} avatar`} />
        <div className={styles.headerInfo}>
          <div className={styles.user}>{authorName}</div>
          <div className={styles.meta}>{post.city || 'Unknown city'}{createdAt ? ` • ${createdAt.toLocaleString()}` : ''}</div>
        </div>

        {!isSingle && <div className={styles.chevron} aria-hidden>›</div>}
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
          <button
            className={`${ui.btnIcon} ${ui.btnIconSm}`}
            aria-label="like"
            onClick={(e) => { e.stopPropagation(); /* TODO: like handler */ }}
          >
            👍 <span className={styles.count}>{post.likes || 0}</span>
          </button>

          <button
            className={`${ui.btnIcon} ${ui.btnIconSm}`}
            aria-label="comment"
            onClick={(e) => { e.stopPropagation(); handleOpenThread(); }}
          >
            💬 <span className={styles.count}>{post.commentsCount ?? post.comments?.length ?? 0}</span>
          </button>
        </div>

        <div className={styles.meta}>{post.anonymous ? '' : post.author?.username || ''}</div>
      </div>
    </article>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
    commentsCount: PropTypes.number,
    comments: PropTypes.array,
  }).isRequired,
};

export default PostCard;
