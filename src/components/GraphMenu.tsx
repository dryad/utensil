import { ClickAwayListener, Divider, MenuItem, MenuList, Popper } from '@mui/material';
import { ChevronDownIcon } from 'assets/icons/svg';
import { styled } from '@mui/material/styles';
import React, {Dispatch, SetStateAction, useState} from 'react';
import { THEME_COLORS } from "constants/colors";

const StyledButton = styled('div')({
  fontSize: '14px',
  color: THEME_COLORS.get('black'),
  fontWeight:'500',
  display: 'flex',
  alignItems:'center',
  gap:'8px',
  cursor:'pointer'
});

const StyledMenuList = styled(MenuList)({
  borderRadius: '8px',
  padding: '6px',
  width: '203px',
  boxShadow: '0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  background: 'white',
  marginLeft: '80px',
  marginTop: '10px'
});

const StyledMenuItem = styled(MenuItem)({
  fontSize:'0.75rem',
  fontWeight: '500',
  lineHeight:'1rem',
  color: THEME_COLORS.get('gray700'),
  padding: '6px 5px 6px 6px'
});

const StyledDivider = styled(Divider)(() => ({
  width: '180px', 
  marginLeft:'6px'
}));

const arrowStyle = {
  '&:before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: '0',
    right: '92px',
    width: '11px',
    height: '6px',
    bgcolor: 'white',
    transform: 'translateY(-50%) rotate(45deg)',
    zIndex: 0,
  }
}

type Props = {
  graphName: string; 
  setOpenSaveGraphDialog: Dispatch<SetStateAction<boolean>>;
  setIsPrivate: Dispatch<SetStateAction<boolean>>;
  saveGraphToDatabase: () => void;
  setIsChangesSavedMessageOpen: Dispatch<SetStateAction<boolean>>;
  closeBar: () => void;
  canBeSavedGraph: boolean;
}

export default function GraphMenu({graphName, setOpenSaveGraphDialog, setIsPrivate, saveGraphToDatabase, setIsChangesSavedMessageOpen, closeBar, canBeSavedGraph}: Props) {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setAnchorEl(null);
    } else if (event.key === 'Escape') {
      setAnchorEl(null);
    }
  }

  return (
    <>
      <StyledButton
        aria-describedby={id} onClick={handleClick}
      >
        {graphName === '' ? 'New graph' : graphName}
        <ChevronDownIcon />
      </StyledButton>
      <Popper
        id={id} open={open} anchorEl={anchorEl} 
      >
        <ClickAwayListener onClickAway={handleClose}>
          <StyledMenuList
            id="composition-menu"
            aria-labelledby="composition-button"
            sx={arrowStyle}
            onKeyDown={handleListKeyDown}
          >
            <StyledMenuItem onClick={handleClose}>
              Edit graph info
            </StyledMenuItem>
            <StyledMenuItem onClick={handleClose}>
              Share
            </StyledMenuItem>
            <StyledDivider />
            <StyledMenuItem 
              onClick={() => {
                if (canBeSavedGraph) {
                  handleClose(); 
                  saveGraphToDatabase();
                  closeBar();
                  setIsChangesSavedMessageOpen(true);
                }                
              }}
              sx={{color: canBeSavedGraph ? '' : THEME_COLORS.get('lightGray'), cursor: canBeSavedGraph ? '' : 'auto'}}
            >
              Save
            </StyledMenuItem>
            <StyledMenuItem onClick={() => {handleClose(); setIsPrivate(false); setOpenSaveGraphDialog(true);}}>
              Save as a new graph
            </StyledMenuItem>
            <StyledDivider />
            <StyledMenuItem onClick={handleClose}>
              Delete
            </StyledMenuItem>
          </StyledMenuList>
        </ClickAwayListener>
      </Popper>
    </>   
  )
}
