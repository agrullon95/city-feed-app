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

export default PostCard;
