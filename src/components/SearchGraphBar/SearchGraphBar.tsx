import { Box, InputAdornment, TextField } from '@mui/material';
import { CloseIcon, SearchIcon } from 'assets/icons/svg';
import { useEffect, useState } from 'react';
import { THEME_COLORS } from "constants/colors";
import GraphItemOnSearchBar from './GraphItemOnSearchBar';
import {Graph} from 'models';
import { styled } from '@mui/material/styles';

type Props = {
  closeBar: () => void;
  graphs: Graph[];
  metaMaskAccount: string;
  onConfirmReplace: () => void;
  onConfirmImport: () => void;
  onGraphSelected: (id: number) => void;
}

const StyledBox = styled(Box)(() => ({
  overflowY:'auto',
  height: '80%',
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

const inputFieldStyles = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#e5e7eb',
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      border: `1px solid ${THEME_COLORS.get('blue')}`,
    },
  },
}

function SearchGraphBar({closeBar, graphs, onConfirmReplace, onConfirmImport, onGraphSelected}: Props) {

  const [filteredGraphs, setFilteredGraphs] = useState([...graphs]);
  const [searchQuery, setSearchQuery] = useState(""); 
  
  console.log('graphs search: ', filteredGraphs);

  const clearSearch = () => {
    setSearchQuery('');
  }

  useEffect(() => {
    setFilteredGraphs([...graphs]);
  }, [graphs]);

  useEffect(() => {
    
    if (searchQuery && searchQuery?.trim().length > 0) {
      const tempGraphs = graphs.filter((el: Graph) => {
        if (el.name.toLowerCase().trim().includes(searchQuery.toLowerCase())) {
          return el
        }
      })
      setFilteredGraphs(tempGraphs);
    } else {
      setFilteredGraphs([...graphs]);
    }
  }, [searchQuery]);

  return (
    <div 
      style={{
        position:'absolute', 
        top:'71px', 
        right:'16px', 
        bottom: '79px', 
        zIndex:'10',
        width: '295px',
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
        sx={inputFieldStyles}
      />
      
      {searchQuery.trim() !== '' && filteredGraphs.length === 0 &&
        <div style={{fontWeight:'500', fontSize:'0.75rem', paddingTop:'12px'}}>
          No results yet
        </div>
      }

      {filteredGraphs.length > 0 &&
        <>
          <div style={{fontWeight:'500', fontSize:'0.75rem', paddingTop:'12px'}}>
            {filteredGraphs.length} result(s)
          </div>
          <StyledBox>
            {filteredGraphs.map((graph: Graph) => 
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