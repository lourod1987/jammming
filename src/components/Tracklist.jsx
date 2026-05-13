function Tracklist (props) {
  const { tracks } = props;
  let trackList;
  if (tracks) {
    trackList = tracks.map((track) => {
      console.log(`My Track view: ${JSON.stringify(track.id)}`)
    return (
    <li key={track.id}>
      <img src={track.album.images.length > 2 ?  track.album.images[2].url : null} />
      <p>{track.name}</p>
      <p>Artist: {track.artists[0].name}</p>
      <p>Album: {track.album.name}</p>
      <p>URI Prop: {track.uri}</p>
    </li>

    );
  });
  }

  return (
    <>
    <h2>Searched Tracks</h2>
    <ul>
      {tracks.length > 0 ? trackList : 'No results'}
    </ul>
    </>
  );
}

export default Tracklist;
