import { InputAdornment, TextField } from '@mui/material';
import { CloseIcon, SearchIcon } from 'assets/icons/svg';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { THEME_COLORS } from "constants/colors";
import {useDebounce} from '../hooks/useDebounce';
import axios from "libs/axios";

type Props = {
  setNavbarMode: Dispatch<SetStateAction<string | null>>;
  metaMaskAccount: string;
}

function SearchGraphBar({setNavbarMode, metaMaskAccount}: Props) {

  const [graphs, setGraphs] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchQuery, 700);

console.log('graphs search: ', graphs);

  useEffect(() => {
		if (debouncedSearchTerm) {
			setSearchTerm(debouncedSearchTerm);
		} else {
			setSearchTerm(debouncedSearchTerm);
		}
	}, [debouncedSearchTerm]);

  const clearSearch = () => {
    setSearchQuery('');
  }

  const refreshList = async () => {
    const { data } = await axios.get(`/api/graphs/?q=${searchTerm}${metaMaskAccount ? `&private=${metaMaskAccount}` : ''}`);
    setGraphs(data);  
  };

  useEffect(() => {
    refreshList(); 
  }, [searchTerm, metaMaskAccount]);

  return (
    <div 
      style={{
        position:'absolute', 
        top:'70px', 
        right:'16px', 
        zIndex:'10',
        width: '295px',
        minHeight: '300px',
        background:'white',
        padding: '20px'
      }}
    >
      <div 
        style={{
          cursor:'pointer',
          position: "absolute",
          top:'1rem',
          right: "1rem"
        }}
        onClick={() => {setNavbarMode(null)}}
      >
        <CloseIcon />
      </div>
      <div style={{fontWeight:'500', fontSize:'0.875rem'}}>
        Search
      </div>
               
      <TextField
        margin="normal"
        id="outlined-basic"
        placeholder='Find any graph'
        rows={1}
        variant="outlined"
        size="small"
        fullWidth
        value={searchQuery}
        onKeyDown={(e) => {e.stopPropagation()}}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          setSearchQuery(e.target.value)
        }}          
        InputProps={{ 
          disableUnderline: true, 
          startAdornment: (
            <InputAdornment position="start" sx={{transform: 'scale(1.5)', color: THEME_COLORS.get("gray")}}>
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchQuery === '' ? null : (<div onClick={clearSearch} style={{cursor:'pointer', color: THEME_COLORS.get("gray")}} ><CloseIcon /></div>) 
        }}
      />
          

    </div>
  )
}

export default SearchGraphBar