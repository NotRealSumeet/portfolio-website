import express from 'express';
import dotenv from 'dotenv';
import loginHandler from './api/spotify/login';
import callbackHandler from './api/spotify/callback';
import nowPlayingHandler from './api/spotify/now-playing';

dotenv.config();

const app = express();
const port = 3001;

app.get('/api/spotify/login', (req, res) => {
  loginHandler(req, res);
});

app.get('/api/spotify/callback', (req, res) => {
  callbackHandler(req, res);
});

app.get('/api/spotify/now-playing', (req, res) => {
  nowPlayingHandler(req, res);
});

app.listen(port, () => {
  console.log(`Local Spotify API server listening at http://localhost:${port}`);
});
