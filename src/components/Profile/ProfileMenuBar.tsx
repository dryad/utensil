import React, { SyntheticEvent, useState } from 'react';
import {
  Tabs,
  Tab,
  styled
} from "@mui/material";
import ProfileSearchGraphs from './ProfileSearchGraphs';
import { THEME_COLORS } from 'constants/colors';
import ShowAccessPrivateGraphsDialog from 'components/Dialog/ShowAccessPrivateGraphsDialog';
import { useMetaMaskAccountStore } from 'store/MetaMaskAccountStore';
import { useShallow } from 'zustand/react/shallow';
import { useProfileGraphsTabStore } from 'store/ProfileGraphsTabStore';

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

function ProfileMenuBar() {
  const [can_edit_profile] = useMetaMaskAccountStore(
    useShallow((state) => [
      state.can_edit_profile,
    ])
  );

  const [currentTab, setCurrentTab] = useProfileGraphsTabStore(
    useShallow((state) => [
        state.currentTab,
        state.setCurrentTab
    ])
  );

  const [showMessage, setShowMessage] = useState(false);
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
            onClick={() => !can_edit_profile() && setShowMessage(true)}
          />
          <Tab label="Shared" {...a11yProps(2)} disableRipple 
            onClick={() => !can_edit_profile() && setShowMessage(true)}
          />
        </StyledTabs>
        
        <ProfileSearchGraphs />
      </div>
      
      <ShowAccessPrivateGraphsDialog 
        showMessage={showMessage} 
        setShowMessage={setShowMessage} 
      />
    </>
  )
}

export default ProfileMenuBar;