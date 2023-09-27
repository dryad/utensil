import React, { useEffect, useState } from 'react';
import { ConceptsIcon, SearchIcon } from 'assets/icons/svg';
import MetaMaskButton from 'components/MetaMaskButton';
import { THEME_COLORS } from "constants/colors";
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SearchGraphBar from '../components/SearchGraphBar/SearchGraphBar';
import ConceptsBar from '../components/ConceptsBar';
import GraphMenu from '../components/GraphMenu';
import ChangesSavedMessage from 'components/ChangesSavedMessage';

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

const StyledBar = styled('div')(() => ({
  display: 'flex',
  alignItems:'center',
  justifyContent:'center',
}));

const StyledMetaMaskButton = styled('div')(() => ({
  height:'55px',
  display: 'flex',
  justifyContent:'center',
  alignItems:'center',
  gap: '2px',
  padding: '4px',
  background: 'white',
  borderRadius: '4px'
}));

function UtensilNavbar(props: any) {

  const [navbarMode, setNavbarMode] = useState<string | null>(null);
  const [isConceptsModeFirstOpened, setIsConceptsModeFirstOpened] = useState(true);
  const [isChangesSavedMessageOpen, setIsChangesSavedMessageOpen] = useState(false);

  const handleChange = (event: React.MouseEvent<HTMLElement>, nextMode: string) => {
    setIsChangesSavedMessageOpen(false);
    setNavbarMode(nextMode);
  };

  const closeBar = () => {
    setNavbarMode(null);
  }

  const closeMessage = () => {
    setIsChangesSavedMessageOpen(false);
  }

  useEffect(() => {
    if (props.trees.length > 0 && isConceptsModeFirstOpened) {
      setNavbarMode('concepts');
      setIsConceptsModeFirstOpened(false);
    }
  },[props.trees])

  return (
    <>
      <StyledBar>
        <div style={{marginLeft:'auto'}}>
          <GraphMenu 
            graphName={props.graphName}
            setOpenSaveGraphDialog={props.setOpenSaveGraphDialog}
            setOpenEditGraphDialog={props.setOpenEditGraphDialog}
            setIsPrivate={props.setIsPrivate}
            saveGraphToDatabase={props.saveGraphToDatabase}
            setIsChangesSavedMessageOpen={setIsChangesSavedMessageOpen}
            closeBar={closeBar}
            canBeSavedGraph={props.canBeSavedGraph}
          />
        </div>       

        <div
          style={{
            minWidth:'295px',
            marginLeft:'auto',
            display: 'flex',
            justifyContent:'space-between',
            gap:'8px'
          }}
        >
          <StyledMetaMaskButton>
            <MetaMaskButton getMetaMaskAccount={props.getMetaMaskAccount} />
          </StyledMetaMaskButton>  

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
        </div>
      </StyledBar>

      {navbarMode === 'search' &&
        <SearchGraphBar 
          closeBar={closeBar} 
          metaMaskAccount={props.metaMaskAccount}
          onConfirmReplace={props.onConfirmReplace}
          onConfirmImport={props.onConfirmImport}
          onGraphSelected={props.onGraphSelected}
        />
      }
      {navbarMode === 'concepts' &&
        <ConceptsBar 
          closeBar={closeBar} 
          trees={props.trees} 
          hoveredNodes={props.hoveredNodes} 
          selectedNodes={props.selectedNodes} 
          setHoveredChipToVis={props.setHoveredChipToVis}
        />
      }    

      {isChangesSavedMessageOpen &&
        <ChangesSavedMessage 
          closeMessage={closeMessage}
          startDate={new Date()}
        />
      } 
    </>   
  )
}

export default UtensilNavbar