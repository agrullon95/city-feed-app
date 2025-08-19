import axios from 'axios';

export async function getServerUser(req) {
  const cookie = req.headers.cookie || '';
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: { cookie },
    });
    return res.data.user;
  } catch {
    return null;
  }
}
