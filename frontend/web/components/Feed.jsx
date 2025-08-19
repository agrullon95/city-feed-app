import React from 'react';
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { fetchPosts } from '../api/posts';
import PostCard from './PostCard';
import SkeletonPost from './SkeletonPost';
import { useAuth } from '../context/authContext';
import styles from '../styles/Feed.module.css';
import ui from '../styles/ui.module.css';
import { debounce } from 'lodash';

const Feed = ({ city, tags }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);
  const observer = useRef(null);
  // Listen for global comment-created events to optimistically update feed counts
  useEffect(() => {
    const handler = (e) => {
      const { postId } = e.detail || {};
      if (!postId) return;
      setPosts(prev => prev.map(p => (p.id === postId ? { ...p, commentsCount: (p.commentsCount ?? p._count?.comments ?? p.comments?.length ?? 0) + 1 } : p)));
    };

    if (typeof window !== 'undefined') window.addEventListener('comment:created', handler);
    return () => { if (typeof window !== 'undefined') window.removeEventListener('comment:created', handler); };
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { posts: newPosts, hasMore: morePosts } = await fetchPosts({ page, limit: 20, city, tags });
      setPosts(prev => {
        const existingIds = new Set(prev.map(post => post.id));
        const uniquePosts = newPosts.filter(post => !existingIds.has(post.id));
        return [...prev, ...uniquePosts];
      });
      setHasMore(morePosts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced version of loadPosts
  const debouncedLoadPosts = debounce(loadPosts, 300);

  // Load posts when page or filters change
  useEffect(() => {
    debouncedLoadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Reset feed when city/tags change
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [city, tags]);

  // IntersectionObserver to implement infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (!hasMore) return;

    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && hasMore) {
          setLoading(true); // Prevent duplicate triggers
          setPage((p) => p + 1);
        }
      },
      { root: null, rootMargin: '200px', threshold: 0.1 }
    );

    observer.current.observe(sentinelRef.current);
    return () => observer.current && observer.current.disconnect();
  }, [sentinelRef.current, hasMore, loading]);

  return (
    <div className={styles.container} aria-busy={loading}>
      {posts.length === 0 && loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonPost key={i} />
          ))}
        </div>
      ) : (
        posts.length === 0 ? (
          <div className={styles.empty}>No posts yet. Be the first to post!</div>
        ) : (
          <div className={styles.grid}>
            {posts.map((post, index) => (
              <PostCard key={post.id || `post-${index}`} post={post} />
            ))}
          </div>
        )
      )}

      {/* sentinel for infinite scroll; visible fallback message for screen readers */}
      <div ref={sentinelRef} className={`${ui.center} ${ui.mtLarge}`} aria-hidden={!loading}>
        {loading && <div className={styles.loadMore}>Loading...</div>}
      </div>

      {/* End of feed message */}
      {!hasMore && !loading && (
        <div className={`${ui.center} ${ui.mtLarge} ${styles.endOfFeed}`}>
          No more posts to load.
        </div>
      )}
    </div>
  );
};

Feed.propTypes = {
  city: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
};

export default Feed;
