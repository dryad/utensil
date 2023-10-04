import { ClickAwayListener, Divider, MenuItem, MenuList, Popper } from '@mui/material';
import { ChevronDownIcon } from 'assets/icons/svg';
import { styled } from '@mui/material/styles';
import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import { THEME_COLORS } from "constants/colors";
import VisCustomNetwork from "libs/vis-custom-network";
import { saveGraphToDB } from 'components/networkFunctions';
import GraphMenuMessage from 'components/GraphMenuMessage';
import functionalGraphData from "functions/functionalGraphIds.json"; 
import SaveGraphDialog from "components/Dialog/SaveGraphDialog";
import EditGraphDialog from "components/Dialog/EditGraphDialog";

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
  setGraphName: Dispatch<SetStateAction<string>>;
  setGraphNote: Dispatch<SetStateAction<string>>;
  setOpenShareGraphDialog: Dispatch<SetStateAction<boolean>>;
  setOpenDeleteGraphDialog: Dispatch<SetStateAction<boolean>>;
  setIsPrivate: Dispatch<SetStateAction<boolean>>;
  isMessageWindowOpen: boolean;
  setIsMessageWindowOpen: Function;
  closeBar: () => void;
  networkRef: React.MutableRefObject<VisCustomNetwork | null>;
  refreshList: Function;
  graphDataToSave: string; 
  prevGraphDataToSave: string;
  canBeSharedGraph: boolean;
  canBeDeletedGraph: boolean;
  setGraphId: Function;
}

type GraphStatus = 'saved' | 'saved as new' | 'edited' | 'null';

export default function GraphMenu({setGraphName, setGraphNote, setOpenShareGraphDialog, setOpenDeleteGraphDialog, setIsPrivate, isMessageWindowOpen, setIsMessageWindowOpen, closeBar, networkRef, refreshList, graphDataToSave, prevGraphDataToSave, canBeSharedGraph, canBeDeletedGraph, setGraphId}: Props) {
  const {graphId, graphName, graphNote, metaMaskAccount, isPrivate} =  JSON.parse(graphDataToSave); 
  const {prevGraphName, prevGraphNote, prevGraphPrivate} =  JSON.parse(prevGraphDataToSave); 

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSaveGraphResponseStatusOk, setIsSaveGraphResponseStatusOk] = useState<boolean | null>(null);
  const [graphStatus, setGraphStatus] = useState<GraphStatus>('null');
  const [openSaveGraphDialog, setOpenSaveGraphDialog] = useState(false);
  const [openEditGraphDialog, setOpenEditGraphDialog] = useState(false);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;
  const dropDownRef = useRef<HTMLDivElement>(null);

  const canBeSavedGraph = !(graphId === null || functionalGraphData.hasOwnProperty(graphId));

  useEffect(() => {
    if (open) {
      setGraphStatus('null');
      setIsSaveGraphResponseStatusOk(null);
    }    
  },[open, anchorEl]);

  useEffect(() => {
    if (isSaveGraphResponseStatusOk === false) {
      setIsPrivate(() => prevGraphPrivate); 
      setGraphName(prevGraphName);
      setGraphNote(prevGraphNote);
    }
  },[isSaveGraphResponseStatusOk])

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
    setGraphStatus('null');
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
                  setGraphStatus('edited')
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
                  setGraphStatus('saved')
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
                setGraphStatus('saved as new')
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

      <SaveGraphDialog
        open={openSaveGraphDialog} 
        setOpen={setOpenSaveGraphDialog}
        graphDataToSave={graphDataToSave}
        prevGraphDataToSave={prevGraphDataToSave}
        setGraphName={setGraphName}
        setGraphNote={setGraphNote}
        setIsPrivate={setIsPrivate}
        saveGraphToDatabase={saveGraphToDatabase}
        closeBar={closeBar}
        setIsMessageWindowOpen={setIsMessageWindowOpen}
      />

      <EditGraphDialog
        open={openEditGraphDialog} 
        setOpen={setOpenEditGraphDialog}
        graphDataToSave={graphDataToSave}
        prevGraphDataToSave={prevGraphDataToSave}
        setGraphName={setGraphName}
        setGraphNote={setGraphNote}
        setIsPrivate={setIsPrivate}
        saveGraphToDatabase={saveGraphToDatabase}
        closeBar={closeBar}
        setIsMessageWindowOpen={setIsMessageWindowOpen}
      />

      {isSaveGraphResponseStatusOk && isMessageWindowOpen && graphStatus === 'saved' &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Changes saved'}
          message={'All changes in your graph were saved.'}
        />
      } 
      {isSaveGraphResponseStatusOk && isMessageWindowOpen && graphStatus === 'saved as new' &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Graph saved'}
          message={'You have saved your graph.'}
        />
      } 
      {isSaveGraphResponseStatusOk && isMessageWindowOpen && graphStatus === 'edited' &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Graph info edited'}
          message={'You have edited your graph info.'}
        />
      } 
      {isSaveGraphResponseStatusOk === false && isMessageWindowOpen && ['saved', 'saved as new'].includes(graphStatus) &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Graph not saved'}
          message={'There was an error. Please try again.'}
        />
      } 
      {isSaveGraphResponseStatusOk === false && isMessageWindowOpen && graphStatus === 'edited' &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Graph not edited'}
          message={'There was an error. Please try again.'}
        />
      } 
    </>   
  )
}
