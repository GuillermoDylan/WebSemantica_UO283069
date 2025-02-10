import React, { useState } from 'react';
import RDFNode from './components/RDFNode';
import './styles.css';
import SearchBar from './components/SearchBar';

function App() {

  const [searchedNode, setSearchedNode] = useState(undefined);

  return (
    <div className="App">
      <SearchBar setSearchedNode={setSearchedNode}/>
      <RDFNode searchedNode={searchedNode} setSearchedNode={setSearchedNode}/>
    </div>
  );
}

export default App;