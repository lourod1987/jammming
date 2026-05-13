import { useState, useEffect } from 'react';
import { goToSpotifyAuth } from '../utils/spotifyAuth';

function AuthForm() {
  const [clientId, setClientId] = useState('');

  useEffect(() => {
    // localStorage.setItem("codeVerifier", codeVerifier);
    // localStorage.setItem('clientId',clientId);
    // gotoSpotifyAuth();
  }, []);

  const handleInput = (e) => {
    setClientId(e.target.value);
  };

  const handleSubmit = () => {
    localStorage.setItem('clientId',clientId);
    goToSpotifyAuth(clientId);
  };

  return (
    <>
      <label>
        Enter your Spotify ClientId:
        <input type="text" placeholder="Spotify ClientId" value={clientId} onChange={handleInput} />
      </label>
      <button onClick={handleSubmit} style={{display: 'inline', padding: 20, width: 200, margin: '20px auto'}}>Submit</button>
    </>
  );
}

export default AuthForm;