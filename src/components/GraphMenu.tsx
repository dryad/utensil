import { ClickAwayListener, Divider, MenuItem, MenuList, Popper } from '@mui/material';
import { ChevronDownIcon } from 'assets/icons/svg';
import { styled } from '@mui/material/styles';
import React, {Dispatch, SetStateAction, useRef, useState} from 'react';
import { THEME_COLORS } from "constants/colors";
import VisCustomNetwork from "libs/vis-custom-network";
import { saveGraphToDB } from 'components/networkFunctions';
import GraphMenuMessage from 'components/GraphMenuMessage';
import functionalGraphData from "functions/functionalGraphIds.json"; 

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
  setOpenShareGraphDialog: Dispatch<SetStateAction<boolean>>;
  setOpenEditGraphDialog: Dispatch<SetStateAction<boolean>>;
  setOpenDeleteGraphDialog: Dispatch<SetStateAction<boolean>>;
  setIsPrivate: Dispatch<SetStateAction<boolean>>;
  isMessageWindowOpen: boolean;
  setIsMessageWindowOpen: Function;
  closeBar: () => void;
  networkRef: React.MutableRefObject<VisCustomNetwork | null>;
  refreshList: Function;
  graphDataToSave: any; 
  canBeSharedGraph: boolean;
  canBeDeletedGraph: boolean;
  setGraphId: Function;
}

export default function GraphMenu({graphName, setOpenSaveGraphDialog, setOpenShareGraphDialog, setOpenEditGraphDialog, setOpenDeleteGraphDialog, setIsPrivate, isMessageWindowOpen, setIsMessageWindowOpen, closeBar, networkRef, refreshList, graphDataToSave, canBeSharedGraph, canBeDeletedGraph, setGraphId}: Props) {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSaveGraphResponseStatusOk, setIsSaveGraphResponseStatusOk] = useState<boolean | null>(null);
  const {graphId, graphNote, metaMaskAccount, isPrivate} =  JSON.parse(graphDataToSave);  
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;
  const dropDownRef = useRef<HTMLDivElement>(null);

  const canBeSavedGraph = !(graphId === null || functionalGraphData.hasOwnProperty(graphId));

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

  const closeMessage = () => {
    setIsMessageWindowOpen(false);
  }  
  
  const saveGraphToDatabase = async(isNew: boolean = false) => saveGraphToDB(isNew, graphName, graphNote, metaMaskAccount, isPrivate, networkRef, refreshList, setIsSaveGraphResponseStatusOk, setGraphId, graphId ); 

  return (
    <>
      <StyledButton 
        aria-describedby={id} 
        onClick={() => {setAnchorEl(anchorEl ? null : dropDownRef.current);}}   
      >
        {graphName === '' ? 'New graph' : graphName} 

        <div onClick={handleClick} ref={dropDownRef}>
         <ChevronDownIcon />  
        </div>                    
      </StyledButton>

      <Popper id={id} open={open} anchorEl={anchorEl} >
        <ClickAwayListener onClickAway={handleClose}>
          <StyledMenuList
            id="graph-menu"
            aria-labelledby="graph-button"
            sx={arrowStyle}
            onKeyDown={handleListKeyDown}
          >
            <StyledMenuItem 
              onClick={() => {
                if (canBeSavedGraph) {
                  handleClose(); 
                  setOpenEditGraphDialog(true);
                }  
              }}
              sx={{
                color: canBeSavedGraph ? '' : THEME_COLORS.get('lightGray'), 
                cursor: canBeSavedGraph ? '' : 'auto'
              }}
            >
              Edit graph info
            </StyledMenuItem>
            <StyledMenuItem 
              onClick={() => {
                if (canBeSharedGraph) {
                  handleClose(); 
                  setOpenShareGraphDialog(true);
                }                
              }}
              sx={{
                color: canBeSharedGraph ? '' : THEME_COLORS.get('lightGray'), 
                cursor: canBeSharedGraph ? '' : 'auto'
              }}            
            >
              Share
            </StyledMenuItem>
            <StyledDivider />
            <StyledMenuItem 
              onClick={() => {
                if (canBeSavedGraph) {
                  handleClose(); 
                  saveGraphToDatabase();
                  closeBar();
                  setIsMessageWindowOpen(true);
                }                
              }}
              sx={{
                color: canBeSavedGraph ? '' : THEME_COLORS.get('lightGray'), 
                cursor: canBeSavedGraph ? '' : 'auto'
              }}
            >
              Save
            </StyledMenuItem>
            <StyledMenuItem 
              onClick={() => {
                handleClose(); 
                setIsPrivate(false); 
                setOpenSaveGraphDialog(true);
              }}
            >
              Save as a new graph
            </StyledMenuItem>
            <StyledDivider />
            <StyledMenuItem 
              onClick={() => {
                if (canBeDeletedGraph) {
                  handleClose(); 
                  setOpenDeleteGraphDialog(true);
                }                
              }}
              sx={{
                color: canBeDeletedGraph ? '' : THEME_COLORS.get('lightGray'), 
                cursor: canBeDeletedGraph ? '' : 'auto'
              }}
            >
              Delete
            </StyledMenuItem>
          </StyledMenuList>
        </ClickAwayListener>
      </Popper>

      {isSaveGraphResponseStatusOk && isMessageWindowOpen &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Changes saved'}
          message={'All changes in your graph were saved.'}
        />
      } 
      {isSaveGraphResponseStatusOk === false && isMessageWindowOpen &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Graph not saved'}
          message={'There was an error. Please try again.'}
        />
      } 
    </>   
  )
}
