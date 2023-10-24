import React, { Dispatch, SetStateAction, SyntheticEvent, useState } from 'react';
import {
  Tabs,
  Tab,
  styled
} from "@mui/material";
import ProfileSearchGraphs from './ProfileSearchGraphs';
import { THEME_COLORS } from 'constants/colors';
import ShowPromptDialog from './ShowPromptDialog';
import { useMetaMaskAccountStore } from 'store/MetaMaskAccountStore';
import { useShallow } from 'zustand/react/shallow';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    aria-label="graphs tabs"
    sx={{
      '& .MuiTabs-indicator': {
        backgroundColor: 'transparent',
      },
      '& .MuiButtonBase-root.MuiTab-root.MuiTab-textColorPrimary': {
        color: THEME_COLORS.get('darkGray'),
        fontSize: '0.875rem',
        fontWeight: '500',
        padding: '8px 12px',
        minHeight: '36px',
        margin: '0',
        textTransform: 'none',
        '&:hover': {
          color: THEME_COLORS.get('black'),
        },
        '&.Mui-selected': {
          color: THEME_COLORS.get('black'),
          fontSize: '0.875rem',
          fontWeight: '500',
          backgroundColor: "white",
          borderRadius: '4px',
        },
      },
    }}
  />
))();

type Props = {
  currentTab: number;
  setCurrentTab: Dispatch<SetStateAction<number>>;  
}

function ProfileMenuBar({ currentTab, setCurrentTab }: Props) {
  const [can_edit_profile] = useMetaMaskAccountStore(
    useShallow((state) => [
      state.can_edit_profile,
    ])
  );

  const [showPrompt, setShowPrompt] = useState(false);
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    can_edit_profile() && setCurrentTab(newValue);
  };

  return (
    <>
      <div 
        style={{
          display:'flex',
          justifyContent:'space-between',
          alignItems:'flex-start'
        }}
      >
        <StyledTabs value={currentTab} onChange={handleChange} >
          <Tab label="Public" {...a11yProps(0)} disableRipple />
          <Tab label="Private" {...a11yProps(1)}  disableRipple
            onClick={() => !can_edit_profile() && setShowPrompt(true)}
          />
          <Tab label="Shared" {...a11yProps(2)} disableRipple 
            onClick={() => !can_edit_profile() && setShowPrompt(true)}
          />
        </StyledTabs>
        
        <ProfileSearchGraphs />
      </div>
      <ShowPromptDialog 
        showPrompt={showPrompt} 
        setShowPrompt={setShowPrompt} 
      >fdggdd
      </ShowPromptDialog>
    </>
  )
}

export default ProfileMenuBar;