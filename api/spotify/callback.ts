import type { IncomingMessage, ServerResponse } from 'http';

export default async function handler(req: any, res: any) {
  const code = req.query.code;
  if (!code) {
    res.status(400).json({ error: 'Authorization code is missing' });
    return;
  }
  
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  
  if (!client_id || !client_secret) {
    res.status(500).json({ error: 'Spotify environment variables are missing' });
    return;
  }

  // Determine redirect URI dynamically or fall back to production
  let redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
  if (!redirect_uri) {
    const host = req.headers.host || 'sumeetism.vercel.app';
    const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
    redirect_uri = `${protocol}://${host}/api/spotify/callback`;
  }
  
  const auth = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
  
  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code.toString(),
        redirect_uri: redirect_uri
      })
    });
    
    const data = await tokenResponse.json() as any;
    if (data.error) {
      res.status(400).json(data);
      return;
    }
    
    // Display refresh token to the user
    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <html>
        <head>
          <title>Spotify Token Success</title>
          <style>
            body { 
              background: #050508; 
              color: #e4e4e7; 
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; 
              padding: 40px; 
              max-width: 600px;
              margin: 40px auto;
              border: 1px solid #18181b;
              border-radius: 12px;
              box-shadow: 0 12px 40px rgba(0,0,0,0.8);
            }
            h1 { color: #742DE1; margin-bottom: 24px; font-weight: bold; }
            p { line-height: 1.6; color: #a1a1aa; }
            strong { color: #fff; }
            pre { 
              background: #09090b; 
              padding: 20px; 
              border-radius: 8px; 
              border: 1px solid #27272a; 
              color: #a78bfa;
              overflow-x: auto;
              font-weight: bold;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <h1>Spotify Token Successfully Generated</h1>
          <p>Copy the refresh token below and add it to your <strong>.env</strong> file (or Vercel Dashboard) as <strong>SPOTIFY_REFRESH_TOKEN</strong>:</p>
          <pre>SPOTIFY_REFRESH_TOKEN=${data.refresh_token}</pre>
          <p style="margin-top: 24px; font-size: 12px; color: #71717a;">You can now close this window and refresh your PLAYER INFO page.</p>
        </body>
      </html>
    `);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
