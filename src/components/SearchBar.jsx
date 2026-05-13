function SearchBar(props) {
  const { search, onChange, onClick } = props;

  return (
    <div>
      <input type="text" placeholder="Search" value={search} onChange={onChange} />
      <button onClick={onClick} style={{display: 'inline', padding: 20, width: 200, margin: '20px auto'}}>Search</button>
    </div>
  );
}

export default SearchBar;