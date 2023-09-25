import { InputAdornment, TextField } from '@mui/material';
import { CloseIcon, SearchIcon } from 'assets/icons/svg';
import { useEffect, useState } from 'react';
import { THEME_COLORS } from "constants/colors";
import {useDebounce} from 'hooks/useDebounce';
import axios from "libs/axios";
import GraphItemOnSearchBar from './GraphItemOnSearchBar';
import {Graph} from 'models';
import { styled } from '@mui/material/styles';

type Props = {
  closeBar: () => void;
  metaMaskAccount: string;
  onConfirmReplace: () => void;
  onConfirmImport: () => void;
  onGraphSelected: (id: number) => void;
}

const StyledBox = styled('div')(({ theme }) => ({
  overflowY:'auto', 
  height: '60%',
  paddingTop: "1rem",
  display:'flex', 
  flexDirection:'column', 
  gap:'16px',
  '&::-webkit-scrollbar':{
    width: '8px',
	},
  '&::-webkit-scrollbar-thumb': {
		background: THEME_COLORS.get('lightGray'),
		borderRadius: '20px',
		':hover': {
			background: THEME_COLORS.get('darkGray')
		}
	}  
}))

function SearchGraphBar({closeBar, metaMaskAccount, onConfirmReplace, onConfirmImport, onGraphSelected}: Props) {

  const [graphs, setGraphs] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchQuery.trim(), 700);

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
    searchQuery && refreshList(); 
  }, [searchTerm, metaMaskAccount]);

  return (
    <div 
      style={{
        position:'absolute', 
        top:'71px', 
        right:'16px', 
        zIndex:'10',
        width: '295px',
        height:'300px',
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
        onClick={closeBar}
      >
        <CloseIcon />
      </div>
      <div style={{fontWeight:'500', fontSize:'1rem'}}>
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
      
      {searchQuery.trim() !== '' && graphs.length === 0 &&
        <div style={{fontWeight:'500', fontSize:'0.75rem', paddingTop:'12px'}}>
          No results yet
        </div>
      }

      {searchQuery.trim() !== '' && graphs.length > 0 &&
        <>
          <div style={{fontWeight:'500', fontSize:'0.75rem', paddingTop:'12px'}}>
            {graphs.length} result(s)
          </div>
          <StyledBox>
            {graphs.map((graph: Graph) => 
              <GraphItemOnSearchBar 
                graph={graph}
                key={graph.id}
                onConfirmReplace={onConfirmReplace}
                onConfirmImport={onConfirmImport}
                onGraphSelected={onGraphSelected}
              />)
            }
          </StyledBox>
        </>        
      }
    </div>
  )
}

export default SearchGraphBar