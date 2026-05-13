import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import Tracklist from '../components/Tracklist';
import { getToken } from '../utils/spotifyAuth';

// const params = {
//   response_type: 'code',
//   code_challenge_method: 'S256',
//   // code_challenge: codeChallenge,
//   redirect_uri: 'http://127.0.0.1:5173/'
// };

const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');
console.log(`CODE: ${code}`);

const getSearch = async (search) => {
  const token = localStorage.getItem('access_token');
  console.log(`Token in getSearch: ${token}`);

  const response = await fetch(`https://api.spotify.com/v1/search?q=${search}&type=track`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });

  const data = await response.json();
  console.log(`Data in getSearch: ${JSON.stringify(data)}`);
  const tracks = data.tracks.items;
  console.log(`Tracks in getSearch: ${JSON.stringify(tracks)}`);
  //want to create an an array of objects with an id, name, artist, album, and uri property
  return tracks;
}


async function getTopTracks() {
  console.log('local storage token: ' + localStorage.getItem('access_token'));
  const token  = localStorage.getItem('access_token');
  console.log('permanentToken storage token: ' + token);

  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5', {
    method: 'GET',
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
  const token = await getToken(code);
  // localStorage.setItem('access_token', token);
  // console.log('accessToken storage token: ' + token);

  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });

  const data = await response.json();
  console.log(`Data in getProfile: ${JSON.stringify(data)}`);
}

function SearchBarContainer() {
  const [search, setSearch] = useState('');
  const [tracks, setTracks] = useState([]);

  const handleSearch = async () => {
    const trackList = await getSearch(search);
    setTracks(trackList);
    setTimeout(() => console.log(`TRACKS after setting: ${JSON.stringify(tracks)}`), 3000);
  };

  const handleInput = (e) => {
    setSearch(e.target.value);
    // console.log(`Currently search value: ${search}`);
  };

  useEffect(() => {
    // getToken(code);
    getProfile();
    // console.log(`TRACKS after setting: ${JSON.stringify(tracks)}`)
  }, []);

  return (
    <div>
      <SearchBar search={search} onChange={handleInput} onClick={handleSearch} />
      <Tracklist tracks={tracks} />
    </div>
  )
}

export default SearchBarContainer;








// {
//   "album":{
//     "album_type":"album",
//     "artists":[
//       {
//         "external_urls":{"spotify":"https://open.spotify.com/artist/2OpHxx1SArSMlBrIMM0aV9"},
//         "href":"https://api.spotify.com/v1/artists/2OpHxx1SArSMlBrIMM0aV9",
//         "id":"2OpHxx1SArSMlBrIMM0aV9",
//         "name":"The Expendables",
//         "type":"artist","uri":"spotify:artist:2OpHxx1SArSMlBrIMM0aV9"
//       }
//     ],
//     "available_markets":["AR","AU","AT","BE","BO","BR","BG","CA","CL","CO","CR","CY","CZ","DK","DO","DE","EC","EE","SV","FI","FR","GR","GT","HN","HK","HU","IS","IE","IT","LV","LT","LU","MY","MT","MX","NL","NZ","NI","NO","PA","PY","PE","PH","PL","PT","SG","SK","ES","SE","CH","TW","TR","UY","US","GB","AD","LI","MC","ID","JP","TH","VN","RO","IL","ZA","SA","AE","BH","QA","OM","KW","EG","MA","DZ","TN","LB","JO","PS","IN","BY","KZ","MD","UA","AL","BA","HR","ME","MK","RS","SI","KR","BD","PK","LK","GH","KE","NG","TZ","UG","AG","AM","BS","BB","BZ","BT","BW","BF","CV","CW","DM","FJ","GM","GE","GD","GW","GY","HT","JM","KI","LS","LR","MW","MV","ML","MH","FM","NA","NR","NE","PW","PG","PR","WS","SM","ST","SN","SC","SL","SB","KN","LC","VC","SR","TL","TO","TT","TV","VU","AZ","BN","BI","KH","CM","TD","KM","GQ","SZ","GA","GN","KG","LA","MO","MR","MN","NP","RW","TG","UZ","ZW","BJ","MG","MU","MZ","AO","CI","DJ","ZM","CD","CG","IQ","LY","TJ","VE","ET","XK"],
//     "external_urls":{"spotify":"https://open.spotify.com/album/3iIUl1OTJKggsB7m8JGE11"},
//     "href":"https://api.spotify.com/v1/albums/3iIUl1OTJKggsB7m8JGE11",
//     "id":"3iIUl1OTJKggsB7m8JGE11",
//     "images":[
//       {"height":640,"width":640,"url":"https://i.scdn.co/image/ab67616d0000b2732943f5555a1b5b0899dac879"},
//       {"height":300,"width":300,"url":"https://i.scdn.co/image/ab67616d00001e022943f5555a1b5b0899dac879"},
//       {"height":64,"width":64,"url":"https://i.scdn.co/image/ab67616d000048512943f5555a1b5b0899dac879"}
//     ],
//     "is_playable":true,
//     "name":"Gettin' Filthy",
//     "release_date":"2004-01-01",
//     "release_date_precision":"day",
//     "total_tracks":20,
//     "type":"album",
//     "uri":"spotify:album:3iIUl1OTJKggsB7m8JGE11"
//   },
//   "artists":[
//     {
//       "external_urls":{"spotify":"https://open.spotify.com/artist/2OpHxx1SArSMlBrIMM0aV9"},
//       "href":"https://api.spotify.com/v1/artists/2OpHxx1SArSMlBrIMM0aV9",
//       "id":"2OpHxx1SArSMlBrIMM0aV9",
//       "name":"The Expendables",
//       "type":"artist",
//       "uri":"spotify:artist:2OpHxx1SArSMlBrIMM0aV9"
//     }
//   ],
//   "available_markets":["AR","AU","AT","BE","BO","BR","BG","CA","CL","CO","CR","CY","CZ","DK","DO","DE","EC","EE","SV","FI","FR","GR","GT","HN","HK","HU","IS","IE","IT","LV","LT","LU","MY","MT","MX","NL","NZ","NI","NO","PA","PY","PE","PH","PL","PT","SG","SK","ES","SE","CH","TW","TR","UY","US","GB","AD","LI","MC","ID","JP","TH","VN","RO","IL","ZA","SA","AE","BH","QA","OM","KW","EG","MA","DZ","TN","LB","JO","PS","IN","BY","KZ","MD","UA","AL","BA","HR","ME","MK","RS","SI","KR","BD","PK","LK","GH","KE","NG","TZ","UG","AG","AM","BS","BB","BZ","BT","BW","BF","CV","CW","DM","FJ","GM","GE","GD","GW","GY","HT","JM","KI","LS","LR","MW","MV","ML","MH","FM","NA","NR","NE","PW","PG","PR","WS","SM","ST","SN","SC","SL","SB","KN","LC","VC","SR","TL","TO","TT","TV","VU","AZ","BN","BI","KH","CM","TD","KM","GQ","SZ","GA","GN","KG","LA","MO","MR","MN","NP","RW","TG","UZ","ZW","BJ","MG","MU","MZ","AO","CI","DJ","ZM","CD","CG","IQ","LY","TJ","VE","ET","XK"],
//   "disc_number":1,
//   "duration_ms":283426,
//   "explicit":false,
//   "external_ids":{"isrc":"USHM20644538"},
//   "external_urls":{"spotify":"https://open.spotify.com/track/7wCgKgkuthR3K568qESxDp"},
//   "href":"https://api.spotify.com/v1/tracks/7wCgKgkuthR3K568qESxDp",
//   "id":"7wCgKgkuthR3K568qESxDp",
//   "is_local":false,
//   "is_playable":true,
//   "name":"Bowl For Two",
//   "popularity":65,
//   "preview_url":null,
//   "track_number":7,
//   "type":"track",
//   "uri":"spotify:track:7wCgKgkuthR3K568qESxDp"
// }