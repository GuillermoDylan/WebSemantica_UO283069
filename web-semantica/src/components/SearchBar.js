import { Button } from '@mui/material';
import {searchNode} from '../utils/RDFUtils';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import React, { useState, useEffect } from 'react';

const SearchBar = ({setSearchedNode}) => {

    const [searchQuery, setSearchQuery] = useState("Lain");
    const [searchResults, setSearchResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);

    useEffect(() => {
        searchNode(searchQuery).then((results) => {
            setSearchResults(results);
            setSearchResults(results);
        });
    }, [searchQuery]);

    return (
        <div style={{position: 'absolute', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Autocomplete
                disablePortal
                loading={filteredResults.length === 0}
                options={!filteredResults ? [{label:"Loading...", id:0}] : filteredResults}
                sx={{ width: 300, marginTop: 5, marginLeft: 5 }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                inputValue={searchQuery}
                onInputChange={(event, newInputValue) => {
                    setSearchQuery(newInputValue);
                    setFilteredResults(searchResults.filter((result) => result.label.toLowerCase().includes(newInputValue.toLowerCase())));
                }}
                renderInput={(params) => <TextField {...params} label="Movie" />}
            />
            <Button variant="contained" href="#contained-buttons" sx={{marginTop: 5, marginLeft: 2}}
            onClick={() => {
                setSearchedNode(filteredResults.find(result => result.label === searchQuery).uri);
            }}>
                Search
            </Button>
        </div>
    );
};

export default SearchBar;