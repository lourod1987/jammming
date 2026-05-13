const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await window.crypto.subtle.digest('SHA-256', data);
};

const base64urlencode = (a) => {
  var str = "";
  var bytes = new Uint8Array(a);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const createCodeChallengeWithVerifier = async () => {
  const codeVerifier = generateRandomString(64);
  console.log(`Right after generating code verifier: ${codeVerifier}`);
  //using await avoids the codeChallenge being saved as [object Promise] which is what I had been sending to Spotify!!
  const codeChallenge = await sha256(codeVerifier)
    .then((hashed) => {
      //now return the base64 encoded hash so that it will be stored in the variable codeChallenge...
      return base64urlencode(hashed);
    })
    .catch((e) => {
      throw new Error(`Error generating code challenge: ${e}`, { cause: e });
    });
    console.log(`Right after generating code challenge: ${codeChallenge}`);

  //Now we'll pop our code challenge in local storage to compare later
  window.localStorage.setItem('code_verifier', codeVerifier);
  console.log(`Right after setting code verifier in LocalStorage: ${localStorage.getItem('code_verifier')}`);
  window.localStorage.setItem('code_challenge', codeChallenge);
};


//This creates the code challenge and verifier then redirects to Spotify for authorisation code which we can use to request an access token
export const goToSpotifyAuth = async (clientId) => {
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  //returns a promise so we need to wait for it to resolve (or reject, but that is unlikely given what it does)...
  try {
    await createCodeChallengeWithVerifier();
  } catch (error) {
    throw new Error(`gotoSpotifyAuth failed to create a code challenge correctly: ${error}`, { cause: error });
  }

  const codeChallenge = window.localStorage.getItem('code_challenge');
  //next we build our request string
  const params = {
    client_id: clientId,
    response_type: 'code',
    redirect_uri: 'http://127.0.0.1:5173/',
    scope: 'user-read-private user-read-email playlist-read-private playlist-read-collaborative user-top-read playlist-modify-private',
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  };
  //as the AUTH_ENDPOINT is a URL object we can set the search params directly
  // AUTH_ENDPOINT.search = new URLSearchParams(params).toString();
  //then redirect to the modified AUTH_ENDPOINT (namely with the params added to the URL object)
  // window.location.href = AUTH_ENDPOINT.toString();
  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
};

export const getToken = async (code) => {
  const codeVerifier = localStorage.getItem('code_verifier');
  console.log(`codeVerifier: ${codeVerifier}`);
  const clientId = localStorage.getItem('clientId');
  const redirectUri = 'http://127.0.0.1:5173/';

  const url = "https://accounts.spotify.com/api/token";

  const body =  new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  }).toString();

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body:body,
  }
  try {
    const body = await fetch(url, payload);
    const response = await body.json();
    console.log(`Response: ${JSON.stringify(response)}`);
  
    localStorage.setItem('access_token', response.access_token);
    return response.access_token;
  } catch (error) {
    console.log(error);
  }
};
