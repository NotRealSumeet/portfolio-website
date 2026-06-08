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

const getNowPlaying = async () => {
  const tokenData = await getAccessToken() as any;
  if (!tokenData || !tokenData.access_token) {
    throw new Error('Failed to get access token');
  }

  return fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });
};

const getRecentlyPlayed = async () => {
  const tokenData = await getAccessToken() as any;
  if (!tokenData || !tokenData.access_token) {
    throw new Error('Failed to get access token');
  }

  return fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });
};

const getMockResponse = (res: any) => {
  return res.status(200).json({
    isPlaying: false,
    title: "BEAUTY AND THE BEAST",
    artist: "Kanye West",
    album: "BULLY",
    albumImageUrl: "https://i.scdn.co/image/ab67616d0000b27395184f6a953569b683ca9a0d",
    songUrl: "https://open.spotify.com/album/5poA9SAx0Xiz1cf17fWBLS",
    previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    progressMs: 0,
    durationMs: 192000,
    timestamp: Date.now()
  });
};

const getRecentlyPlayedResponse = async (res: any) => {
  try {
    const recentlyPlayedRes = await getRecentlyPlayed();
    if (recentlyPlayedRes.status === 204 || recentlyPlayedRes.status > 400) {
      return getMockResponse(res);
    }
    
    const recent = await recentlyPlayedRes.json() as any;
    if (!recent || !recent.items || recent.items.length === 0) {
      return getMockResponse(res);
    }
    
    const track = recent.items[0].track;
    const title = track.name;
    const artist = track.artists.map((_artist: any) => _artist.name).join(', ');
    const album = track.album.name;
    const albumImageUrl = track.album.images[0]?.url || "https://i.scdn.co/image/ab67616d0000b27395184f6a953569b683ca9a0d";
    const songUrl = track.external_urls.spotify;
    const previewUrl = track.preview_url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3";
    const durationMs = track.duration_ms;
    
    return res.status(200).json({
      isPlaying: false,
      title,
      artist,
      album,
      albumImageUrl,
      songUrl,
      previewUrl,
      progressMs: 0,
      durationMs,
      timestamp: new Date(recent.items[0].played_at).getTime()
    });
  } catch (err) {
    return getMockResponse(res);
  }
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
    const nowPlayingRes = await getNowPlaying();
    if (nowPlayingRes.status === 204 || nowPlayingRes.status > 400) {
      return await getRecentlyPlayedResponse(res);
    }
    
    const song = await nowPlayingRes.json() as any;
    if (!song || !song.item) {
      return await getRecentlyPlayedResponse(res);
    }
    
    if (song.currently_playing_type === 'ad') {
      return res.status(200).json({
        isPlaying: false,
        isAd: true,
        title: "Advertisement",
        artist: "Spotify Ad",
        album: "Spotify",
        albumImageUrl: "https://i.scdn.co/image/ab67616d0000b27395184f6a953569b683ca9a0d",
        songUrl: "https://open.spotify.com",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        progressMs: 0,
        durationMs: 30000,
        timestamp: Date.now()
      });
    }
    
    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists.map((_artist: any) => _artist.name).join(', ');
    const album = song.item.album.name;
    const albumImageUrl = song.item.album.images[0]?.url || "https://i.scdn.co/image/ab67616d0000b27395184f6a953569b683ca9a0d";
    const songUrl = song.item.external_urls.spotify;
    const previewUrl = song.item.preview_url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3";
    const progressMs = song.progress_ms;
    const durationMs = song.item.duration_ms;
    const timestamp = song.timestamp;
    
    return res.status(200).json({
      isPlaying,
      title,
      artist,
      album,
      albumImageUrl,
      songUrl,
      previewUrl,
      progressMs,
      durationMs,
      timestamp
    });
  } catch (err) {
    return await getRecentlyPlayedResponse(res);
  }
}
