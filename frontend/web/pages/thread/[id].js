import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import PostCard from '../../components/PostCard';
import styles from '../../styles/Thread.module.css';

const ThreadPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchThread = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`);
        setThread(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchThread();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!thread) return <div>Thread not found.</div>;

  return (
    <div className={styles.container}>
      <PostCard post={thread} />
    </div>
  );
};

export default ThreadPage;
