import React from 'react';
import PropTypes from 'prop-types';

const PostCard = ({ post }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
      <p>{post.content}</p>
      <p>City: {post.city}</p>
      {post.tags && <p>Tags: {post.tags.join(', ')}</p>}
      {!post.anonymous && <p>By: {post.author?.username || 'Unknown'}</p>}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    content: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    anonymous: PropTypes.bool,
    author: PropTypes.shape({
      username: PropTypes.string,
    }),
  }).isRequired,
};

export default PostCard;
