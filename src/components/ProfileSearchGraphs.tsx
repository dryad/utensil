import React, { useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { CloseIcon, SearchIcon } from 'assets/icons/svg';
import { THEME_COLORS } from 'constants/colors';
import { useAllGraphsStore } from 'store/AllGraphsStore';
import { useShallow } from 'zustand/react/shallow';

const inputFieldStyles = {
  '& .MuiOutlinedInput-root': {
    height: '36px',
    padding: '8px 12px 8px 8px',
    display: 'flex',
    alignItems:'center',
    gap: '10px',
    fontSize: '0.875rem',
    '& fieldset': {
      borderColor: '#bcbcbc',
      borderRadius: '6px',
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      border: `1px solid ${THEME_COLORS.get('blue')}`,
    },
  },
}

function ProfileSearchGraphs() {
  const [searchString, setSearchString] = useAllGraphsStore(
    useShallow((state) => [
      state.searchString,
      state.setSearchString,
    ])
);

  const clearSearch = () => {
    setSearchString('');
  }

  return (
    <div
      style={{
        width: '438px',
      }}
    >
      <TextField
        id="outlined-basic"
        placeholder='Search graphs'
        rows={1}
        variant="outlined"
        size="small"
        fullWidth
        value={searchString}
        onKeyDown={(e) => {e.stopPropagation()}}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          setSearchString(e.target.value)
        }}          
        InputProps={{ 
          disableUnderline: true, 
          startAdornment: (
            <InputAdornment position="start" sx={{transform: 'scale(1.5)', color: THEME_COLORS.get("black")}}>
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchString === '' ? null : (<div onClick={clearSearch} style={{cursor:'pointer', color: THEME_COLORS.get("gray")}} ><CloseIcon /></div>) 
        }}
        sx={inputFieldStyles}
      />
    </div>
  )
}

export default ProfileSearchGraphs