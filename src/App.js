import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Profile } from "./profile";
import Playlist from './spotifyGetPlaylist';

const clientId = "51a424f7865249b7a40a7f54aba825c2"; 
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

export async function init() {
  if (!code) {
    redirectToAuthCodeFlow(clientId);
    throw Error;
  } else {
    const accessToken = await getAccessToken(clientId, code);
    const profile = await fetchProfile(accessToken);
    return { accessToken, profile };
  }
}

async function redirectToAuthCodeFlow(clientId) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", "http://localhost:3000/callback");
  params.append("scope", "user-read-private user-read-email");
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function getAccessToken(clientId, code) {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "http://localhost:3000/callback");
  params.append("code_verifier", verifier);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const { access_token } = await result.json();
  return access_token;
}

async function fetchProfile(token) {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return await result.json();
}

export function App(props) {
  const [playlistData, setPlaylistData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { accessToken } = await init();
        // You may replace the hardcoded playlist ID with the one you want to fetch
        const response = await axios.get('https://api.spotify.com/v1/playlists/3tK5Fh5GF92ehN8N2L0EYW/tracks', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setPlaylistData(response.data.items);
      } catch (error) {
        setError(error);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!playlistData) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="App">
        <header className="App-header">
          <Profile props={props} />
          <Playlist tracks={playlistData} />
        </header>
      </div>
    );
  }
}
