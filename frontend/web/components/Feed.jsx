import { useState, useEffect } from 'react';
import { fetchPosts } from '../api/posts';
import PostCard from './PostCard';

const Feed = ({ city, tags }) => {
    const [ posts, setPosts] = useState([]);
    const [ page, setPage ] = useState(1);
    const [loading, setLoading] = useState(false);

    const loadPosts = async () => {
        setLoading(true);
        const newPosts = await fetchPosts({ page, city, tags });
        console.log({newPosts});
        setPosts( (prevPosts) => [...prevPosts, ...newPosts]);
        setLoading(false);
    }

    console.log({posts});

    useEffect(() => {
        loadPosts();
    }, [page, city, tags]);

    const handleLoadMore = () => setPage((prevPage) => prevPage + 1);

    return (
        <div>
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
            <button onClick={handleLoadMore} disabled={loading}>
                {loading ? 'Loading...' : 'Load More'}
            </button>
        </div>
    )
}

export default Feed;