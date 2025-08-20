import client from './client';

export const fetchPosts = async ({ page = 1, limit = 20, city, tags }) => {
  const params = { page, limit, city, tags: tags?.join(',') };
  const { data } = await client.get('/api/posts', { params });
  return data;
};
