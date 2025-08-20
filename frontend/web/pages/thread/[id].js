import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import client from '../../api/client';
import Thread from '../../components/Thread';
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
        const res = await client.get(`/api/posts/${id}`);
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

  const handleCommentAdded = (createdComment) => {
    setThread(prev => ({
      ...prev,
      commentsCount: (prev?.commentsCount ?? prev?.comments?.length ?? 0) + 1,
    }));
  };

  return (
    <div className={styles.container}>
      <Thread thread={thread} onCommentAdded={handleCommentAdded} />
    </div>
  );
};

export default ThreadPage;
