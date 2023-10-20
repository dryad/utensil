import React, { Dispatch, SetStateAction, SyntheticEvent } from 'react'
import {
  Container,
  Box,
  Button,
  Grid,
  Typography,
  Avatar,
  Stack,
  Tabs,
  Tab,
  Drawer,
  Tooltip,
  styled
} from "@mui/material";
import { THEME_COLORS } from 'constants/colors';

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

  
  
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <div 
      style={{
        display:'flex',
        justifyContent:'space-between'
      }}
    >
      <StyledTabs value={currentTab} onChange={handleChange} >
        <Tab label="Public" {...a11yProps(0)} disableRipple />
        <Tab label="Private" {...a11yProps(1)}  disableRipple
          // onClick={() => !can_edit_profile() && setShowPrompt(true)}
        />
        <Tab label="Shared" {...a11yProps(2)} disableRipple />
      </StyledTabs>
      
      {/* <ProfileSearchGraphs /> */}
    </div>
  )
}

export default ProfileMenuBar;