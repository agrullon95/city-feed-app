import React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import PostCard from './PostCard';
import { useAuth } from '../context/authContext';
import styles from '../styles/Feed.module.css';

const Feed = ({ city, tags }) => {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        params: { page, city, tags },
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(prev => [...prev, ...res.data]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [page, city, tags]);

  return (
    <div className={styles.container}>
      {posts.length === 0 ? (
        <div className={styles.empty}>No posts yet. Be the first to post!</div>
      ) : (
        <div className={styles.grid}>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 18 }}>
        <button className={styles.loadMore} onClick={() => setPage(p => p + 1)} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      </div>
    </div>
  );
};

Feed.propTypes = {
  city: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
};

export default Feed;
