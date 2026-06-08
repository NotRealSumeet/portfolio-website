import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(req: any, res: any) {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  
  if (!client_id) {
    res.status(500).json({ error: 'SPOTIFY_CLIENT_ID environment variable is missing' });
    return;
  }

  // Determine redirect URI dynamically or fall back to production
  let redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
  if (!redirect_uri) {
    const host = req.headers.host || 'sumeetism.vercel.app';
    const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
    redirect_uri = `${protocol}://${host}/api/spotify/callback`;
  }
  
  const scopes = 'user-read-currently-playing user-read-recently-played';
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
  
  res.redirect(authUrl);
}
