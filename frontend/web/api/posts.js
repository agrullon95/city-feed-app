import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const fetchPosts = async ({ page = 1, limit = 20, city, tags }) => {
  const params = { page, limit, city, tags: tags?.join(',') };
  const { data } = await axios.get(`${API_BASE}/api/posts`, { params });
  return data;
};
