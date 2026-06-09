import type { IncomingMessage, ServerResponse } from 'http';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const getAccessToken = async () => {
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token || '',
    }),
  });

  return response.json();
};

const getRecentlyPlayed = async (limit = 5) => {
  const tokenData = await getAccessToken() as any;
  if (!tokenData || !tokenData.access_token) {
    throw new Error('Failed to get access token');
  }

  return fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });
};

const getMockResponse = (res: any) => {
  return res.status(200).json({
    tracks: [
      {
        title: "BEAUTY AND THE BEAST",
        artist: "Kanye West",
        album: "BULLY",
        albumImageUrl: "/spotify/bully.png",
        songUrl: "https://open.spotify.com/album/5poA9SAx0Xiz1cf17fWBLS",
        playedAt: Date.now() - 120000 // 2 minutes ago
      },
      {
        title: "NIGHTCALL",
        artist: "Kavinsky",
        album: "Outrun",
        albumImageUrl: "/spotify/nightcall.png",
        songUrl: "https://open.spotify.com/track/0mt02gJ425X5zI743g3Iuu",
        playedAt: Date.now() - 3600000 // 1 hour ago
      },
      {
        title: "STARBOY",
        artist: "The Weeknd",
        album: "Starboy",
        albumImageUrl: "/spotify/starboy.png",
        songUrl: "https://open.spotify.com/track/7i5i5VzK82I27V0pE33W6X",
        playedAt: Date.now() - 14400000 // 4 hours ago
      },
      {
        title: "MIDNIGHT CITY",
        artist: "M83",
        album: "Hurry Up, We're Dreaming",
        albumImageUrl: "/spotify/midnightcity.png",
        songUrl: "https://open.spotify.com/track/1eyZp2GMQI27JbpZ78jLci",
        playedAt: Date.now() - 86400000 // 1 day ago
      }
    ]
  });
};

export default async function handler(req: any, res: any) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (!client_id || !client_secret || !refresh_token) {
    return getMockResponse(res);
  }
  
  try {
    const recentlyPlayedRes = await getRecentlyPlayed(5);
    if (recentlyPlayedRes.status === 204 || recentlyPlayedRes.status > 400) {
      return getMockResponse(res);
    }
    
    const recent = await recentlyPlayedRes.json() as any;
    if (!recent || !recent.items || recent.items.length === 0) {
      return getMockResponse(res);
    }
    
    const tracks = recent.items.map((item: any) => {
      const track = item.track;
      return {
        title: track.name,
        artist: track.artists.map((_artist: any) => _artist.name).join(', '),
        album: track.album.name,
        albumImageUrl: track.album.images[0]?.url || "/spotify/bully.png",
        songUrl: track.external_urls.spotify,
        playedAt: new Date(item.played_at).getTime()
      };
    });
    
    return res.status(200).json({ tracks });
  } catch (err) {
    return getMockResponse(res);
  }
}
