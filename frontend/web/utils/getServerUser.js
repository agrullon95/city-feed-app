import client from '../api/client';

export async function getServerUser(req) {
  const cookie = req.headers.cookie || '';
  try {
  const res = await client.get('/api/auth/me');
  return res.data.user;
  } catch {
    return null;
  }
}
