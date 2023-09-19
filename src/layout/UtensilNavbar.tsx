import React, { useState } from 'react';
import { ConceptsIcon, SearchIcon } from 'assets/icons/svg';
import MetaMaskButton from 'components/MetaMaskButton';
import { THEME_COLORS } from "constants/colors";
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SearchGraphBar from '../components/SearchGraphBar';

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  height: '47px',
  width: '47px',
  background: 'white', 
  color: THEME_COLORS.get("darkGray"),
  border: 'none',
  borderRadius: '4px',
  padding: '5px',
  ':hover': {
      border: 'none',
      borderRadius: '4px',
      background: THEME_COLORS.get("blue"),
      color: 'white'
  },
  ':hover&.Mui-selected': {
      border: 'none',
      borderRadius: '4px',
      backgroundColor: THEME_COLORS.get("blue"),
      color: 'white'
  },
  '&.Mui-selected': {
      border: 'none',
      borderRadius: '4px',
      backgroundColor: THEME_COLORS.get("blue"),
      color: 'white'
  },  
  '&.Mui-disabled': {
      border: 'none',
      borderRadius: '4px',
  },       
}))

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    padding: '4px',
    backgroundColor: 'white',
    display: 'flex',
    gap: '2px',
    '.MuiToggleButtonGroup-grouped:not(:last-of-type)': {
        borderRadius: '4px',
    },
    '.MuiToggleButtonGroup-grouped:not(:first-of-type)': {
        borderRadius: '4px',
    },
}));

function UtensilNavbar(props: any) {

  const [navbarMode, setNavbarMode] = useState<string | null>(null);
  
  const handleChange = (event: React.MouseEvent<HTMLElement>, nextMode: string) => {
    setNavbarMode(nextMode);
  };

  return (
    <div>
      {/* <NewGraphMenu /> */}
      <div
        style={{
          display: 'flex',
          justifyContent:'space-between',
          gap:'8px'
        }}
      >
        <div
          style={{
            height:'55px',
            display: 'flex',
            justifyContent:'center',
            alignItems:'center',
            gap: '2px',
            padding: '4px',
            background: 'white',
            borderRadius: '4px'
          }}
        >
          <MetaMaskButton getMetaMaskAccount={props.getMetaMaskAccount} />
        </div>  

        <StyledToggleButtonGroup
          orientation="horizontal"
          value={navbarMode} 
          exclusive
          onChange={handleChange}
        >
          <StyledToggleButton aria-label="search" value='search'>
            <SearchIcon />
          </StyledToggleButton>
          <StyledToggleButton aria-label="concepts" value='concepts'>
            <ConceptsIcon />
          </StyledToggleButton>
        </StyledToggleButtonGroup>

        {navbarMode === 'search' &&
          <SearchGraphBar setNavbarMode={setNavbarMode} metaMaskAccount={props.metaMaskAccount}/>
        }
        {/* {navbarMode === 'concepts' &&
          <ConceptsBar />
        } */}
       
      </div>
    </div>
  )
}

export default UtensilNavbar