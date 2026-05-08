import SearchBar from '../components/SearchBar';
import { useState, useEffect } from 'react';

const API = {
  clientId: '03b4bc8c574f47fe88899a85ec198649',
  clientSecret: '306924e8cb5147b4987990af75006686',
};

// const tokenPromise = () => {
//   return new Promise ( (resolve, reject) => {
//     fetch('https://accounts.spotify.com/api/token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         Authorization: `Basic ${btoa(`${API.clientId}:${API.clientSecret}`)}`,
//       },
//       body: new URLSearchParams({ grant_type: 'client_credentials' }),
//       json: true
//     })
//     .then(async (response) => {
//       if (!response.ok) throw new Error(`Spotify token error: ${response.status}`);
//       const body = await response.json();
//       console.log(`token in tokenPromise: ${JSON.stringify(body)}`);
//       resolve(body.access_token);
//     }).catch((err) => reject(err));
//   });
// }

const tokenPromise = async () => {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${API.clientId}:${API.clientSecret}`)}`,
      },
      body: new URLSearchParams({ grant_type: 'client_credentials' }),
    });
    if (response.ok) {
      const body = await response.json();
      localStorage.setItem('access_token', body.access_token);
      console.log(`token in tokenPromise: ${localStorage.getItem('access_token')}`);
      getProfile();
    }
  } catch (error) {
    console.log(`Spotify token error: ${error}`);
  }
}

async function getTopTracks() {
  const token = await tokenPromise();
  localStorage.setItem('access_token', token);
  console.log('local storage token: ' + localStorage.getItem('access_token'));
  const permanentToken = localStorage.getItem('access_token');
  console.log('permanentToken storage token: ' + permanentToken);
  // console.log(`token in getTopTracks: ${JSON.stringify(permanentToken)}`);
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  fetch('https://api.spotify.com/v1/me', {
    // method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (response) => {
    const tracks =  await response.json();
    console.log(`response in getTopTracks: ${JSON.stringify(tracks)}`);
    return tracks;
  }).catch((err) => console.error('Spotify auth failed', err));
}

async function getProfile() {
  // const token = await tokenPromise();
  // localStorage.setItem('access_token', token);
  let accessToken = localStorage.getItem('access_token');
  console.log('accessToken storage token: ' + accessToken);

  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  });

  const data = await response.json();
  console.log(`Data in getProfile: ${JSON.stringify(data)}`);
}

function SearchBarContainer() {
  const [search, setSearch] = useState('');

  useEffect(() => {
    tokenPromise();
    // getProfile();
  }, []);

  return (
    <div>
      <SearchBar search={search} setSearch={setSearch} />
    </div>
  )
}

export default SearchBarContainer;