import SearchResults from '../components/SearchResults';
import { useState } from 'react';

function SearchResultsContainer() {
  const [results, setResults] = useState([]);

  return (
    <div>
      <SearchResults results={results} />
    </div>
  )
}

export default SearchResultsContainer;