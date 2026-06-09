import type { IncomingMessage, ServerResponse } from 'http';

const LASTFM_USERNAME = process.env.LASTFM_USERNAME || 'Sumit_shah';
const LASTFM_API_KEY = process.env.LASTFM_API_KEY || '2bed1944f3a074be318fed728e990ffe';
const FALLBACK_IMAGE_URL = '/spotify/bully.png';

const getMockResponse = (res: any) => {
  return res.status(200).json({
    tracks: [
      {
        title: "BEAUTY AND THE BEAST",
        artist: "Kanye West",
        album: "BULLY",
        albumImageUrl: "/spotify/bully.png",
        songUrl: "https://open.spotify.com/album/5poA9SAx0Xiz1cf17fWBLS",
        playedAt: Date.now() - 120000,
        currentlyPlaying: false
      },
      {
        title: "NIGHTCALL",
        artist: "Kavinsky",
        album: "Outrun",
        albumImageUrl: "/spotify/nightcall.png",
        songUrl: "https://open.spotify.com/track/0mt02gJ425X5zI743g3Iuu",
        playedAt: Date.now() - 3600000,
        currentlyPlaying: false
      },
      {
        title: "STARBOY",
        artist: "The Weeknd",
        album: "Starboy",
        albumImageUrl: "/spotify/starboy.png",
        songUrl: "https://open.spotify.com/track/7i5i5VzK82I27V0pE33W6X",
        playedAt: Date.now() - 14400000,
        currentlyPlaying: false
      },
      {
        title: "MIDNIGHT CITY",
        artist: "M83",
        album: "Hurry Up, We're Dreaming",
        albumImageUrl: "/spotify/midnightcity.png",
        songUrl: "https://open.spotify.com/track/1eyZp2GMQI27JbpZ78jLci",
        playedAt: Date.now() - 86400000,
        currentlyPlaying: false
      }
    ]
  });
};

export default async function handler(req: any, res: any) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=5`;
    const lastFmRes = await fetch(url);
    if (!lastFmRes.ok) {
      throw new Error('Last.fm API error');
    }
    const data = await lastFmRes.json() as any;
    if (!data.recenttracks || !data.recenttracks.track) {
      throw new Error('Invalid Last.fm response');
    }

    const rawTracks = data.recenttracks.track;
    const tracks = rawTracks.map((track: any) => {
      const isNowPlaying = track['@attr']?.nowplaying === 'true' || track['@attr']?.currentlyplaying === 'true';
      
      let albumImageUrl = FALLBACK_IMAGE_URL;
      if (track.image && track.image.length > 0) {
        const xlImage = track.image.find((img: any) => img.size === 'extralarge');
        if (xlImage && xlImage['#text']) {
          albumImageUrl = xlImage['#text'];
        } else {
          const lgImage = track.image.find((img: any) => img.size === 'large');
          if (lgImage && lgImage['#text']) {
            albumImageUrl = lgImage['#text'];
          } else {
            const anyImage = track.image.find((img: any) => img['#text']);
            if (anyImage) albumImageUrl = anyImage['#text'];
          }
        }
      }

      return {
        title: track.name || 'UNKNOWN TRACK',
        artist: track.artist?.['#text'] || 'UNKNOWN ARTIST',
        album: track.album?.['#text'] || 'UNKNOWN ALBUM',
        albumImageUrl,
        songUrl: track.url || 'https://www.last.fm',
        playedAt: isNowPlaying ? Date.now() : (track.date?.uts ? parseInt(track.date.uts) * 1000 : Date.now()),
        currentlyPlaying: isNowPlaying
      };
    });

    return res.status(200).json({ tracks });
  } catch (err) {
    console.error('Error fetching Last.fm on backend endpoint:', err);
    return getMockResponse(res);
  }
}

