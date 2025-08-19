import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import styles from '../styles/NewPostForm.module.css';

const NewPostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [city, setCity] = useState('');
  const [tags, setTags] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content || !city) return alert('Content and city are required');
    setLoading(true);

    try {
      const payload = {
        content,
        city,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        anonymous,
      };

      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, payload, { withCredentials: true });

      setContent('');
      setCity('');
      setTags('');
      setAnonymous(false);

      if (onPostCreated) onPostCreated(data);
    } catch (err) {
      console.error(err);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.card} aria-labelledby="new-post-heading">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label id="new-post-heading" className="sr-only">Create a post</label>
          <textarea
            className={styles.textarea}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="What's on your mind?"
            aria-label="Post content"
          />
        </div>

        <div className={styles.row}>
          <div className={`${styles.field} ${styles.flexGrow}`}>
            <input
              className={styles.input}
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="City"
              aria-label="City"
            />
          </div>

          <div className={`${styles.field} ${styles.flexGrow}`}>
            <input
              className={styles.input}
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
              aria-label="Tags"
            />
          </div>
        </div>

        <div className={styles.row}>
          <label className={styles.checkbox}>
            <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} />
            <span>Post anonymously</span>
          </label>

          <div className={`${styles.hint} ${styles.hintRight}`}>
            Optional: tags help others find your post
          </div>
        </div>

        <div className={styles.actions}>
          <div />
          <button className={styles.submit} type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </section>
  );
};

NewPostForm.propTypes = {
  onPostCreated: PropTypes.func,
};

export default NewPostForm;
