import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

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
    <form onSubmit={handleSubmit}>
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="What's on your mind?" />
      <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City" />
      <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma separated)" />
      <label>
        <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} /> Post anonymously
      </label>
      <button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post'}</button>
    </form>
  );
};
NewPostForm.propTypes = {
  onPostCreated: PropTypes.func,
};

export default NewPostForm;
