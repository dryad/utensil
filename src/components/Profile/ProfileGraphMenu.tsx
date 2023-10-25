import { ClickAwayListener, Divider, MenuItem, MenuList, Popper } from '@mui/material';
import { ChevronDownIcon, DotsVerticalIcon } from 'assets/icons/svg';
import { styled } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react';
import { THEME_COLORS } from "constants/colors";
import VisCustomNetwork from "libs/vis-custom-network";
import { deleteGraphFromDB, saveGraphFromProfileToDB } from 'components/networkFunctions';
import GraphMenuMessage from 'components/GraphMenuMessage';
import functionalGraphData from "functions/functionalGraphIds.json"; 
import SaveGraphDialog from "components/Dialog/SaveGraphDialog";
import EditGraphDialog from "components/Dialog/EditGraphDialog";
import ShareGraphDialog from "components/Dialog/ShareGraphDialog";
import DeleteGraphDialog from "components/Dialog/DeleteGraphDialog";
import ShowGetAccountDialog from 'components/Dialog/ShowGetAccountDialog';
import { useGraphStore } from 'store/GraphStore';
import { useShallow } from 'zustand/react/shallow'
import { useMetaMaskAccountStore } from 'store/MetaMaskAccountStore';
import { Graph } from "models";
import { useParams } from 'react-router-dom';
import { useAllGraphsStore } from 'store/AllGraphsStore';

const StyledButton = styled('div')({
  width: '28px',
  height: '28px',
  backgroundColor: 'white',
  borderRadius: '4px',
  padding: '4px',
  display: 'flex',
  alignItems:'center',
  justifyContent:'center',
  cursor:'pointer'
});

const StyledMenuList = styled(MenuList)({
  borderRadius: '8px',
  padding: '6px',
  width: '203px',
  boxShadow: '0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  background: 'white',
  marginTop: '6px',
  marginLeft: '174px'
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

type GraphProps = {
  graph: Graph;
};
type GraphStatus = 'saved' | 'saved as new' | 'edited' | 'shared' | 'deleted' | 'null';

export default function ProfileGraphMenu({ graph }: GraphProps) {
  const [graphName, graphNote, isPrivate, graphId, setGraphName, setGraphNote, setIsPrivate, prevGraphName, prevGraphNote, prevGraphPrivate, setGraphId, setPrevGraphName, setPrevGraphNote, setPrevGraphPrivate] = useGraphStore(
    useShallow((state) => [
      state.graphName, 
      state.graphNote,
      state.isPrivate,
      state.graphId,
      state.setGraphName,
      state.setGraphNote,
      state.setIsPrivate,
      state.prevGraphName,
      state.prevGraphNote,
      state.prevGraphPrivate,  
      state.setGraphId, 
      state.setGraphName,
      state.setGraphNote,
      state.setIsPrivate   
    ])
  );

  const [getPublicGraphs, getPrivateGraphs, getSharedGraphs] = useAllGraphsStore(
    useShallow((state) => [
      state.getPublicGraphs,
      state.getPrivateGraphs,
      state.getSharedGraphs
    ])
  );

  const [metaMaskAccount, can_edit_profile] = useMetaMaskAccountStore(
    useShallow((state) => [
      state.metaMaskAccount,
      state.can_edit_profile
    ])
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSaveGraphResponseStatusOk, setIsSaveGraphResponseStatusOk] = useState<boolean | null>(null);
  const [isShareGraphResponseStatusOk, setIsShareGraphResponseStatusOk] = useState<boolean | null>(null);
  const [isDeleteGraphResponseStatusOk, setIsDeleteGraphResponseStatusOk] = useState<boolean | null>(null);
  const [graphStatus, setGraphStatus] = useState<GraphStatus>('null');
  const [openSaveGraphDialog, setOpenSaveGraphDialog] = useState(false);
  const [openEditGraphDialog, setOpenEditGraphDialog] = useState(false);
  const [openShareGraphDialog, setOpenShareGraphDialog] = useState(false);
  const [openDeleteGraphDialog, setOpenDeleteGraphDialog] = useState(false);
  const [showGetAccountMessage, setShowGetAccountMessage] = useState(false);
  const [isMessageWindowOpen, setIsMessageWindowOpen] = useState(false);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;
  // const dropDownRef = useRef<HTMLDivElement>(null);

  const canBeEditedGraph = !functionalGraphData.hasOwnProperty(graph.id!);
  const canBeSavedGraph = !(graphId === null || functionalGraphData.hasOwnProperty(graphId));
  const canBeSharedGraph = canBeSavedGraph;
  const canBeDeletedGraph = (metaMaskAccount && graph.creator === metaMaskAccount) || isPrivate;
  const canBePrivateGraph = graph.creator === metaMaskAccount;

  useEffect(() => {
    if (openEditGraphDialog) {
      setGraphName(graph.name);
      setGraphNote(graph.note);
      setIsPrivate(graph.private !== '');
      setPrevGraphName(graph.name);
      setPrevGraphNote(graph.note);
      setPrevGraphPrivate(graph.private !== '');
      setGraphId(graph.id!);
    }
  },[openEditGraphDialog])

  useEffect(() => {
    if (open) {
      setGraphStatus('null');
      setIsSaveGraphResponseStatusOk(null);
      setIsShareGraphResponseStatusOk(null);
      setIsDeleteGraphResponseStatusOk(null);
    }    
  },[open, anchorEl]);

  useEffect(() => {
    if (isSaveGraphResponseStatusOk === false) {
      setIsPrivate(prevGraphPrivate); 
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

  const { addressId } = useParams();


  const refreshList = async () => {
    getPublicGraphs();
    if (can_edit_profile() && addressId) {
      getPrivateGraphs(addressId);
    }  
    if (can_edit_profile() && addressId) {
      getSharedGraphs(addressId);
    } 
  }
  
  const saveGraphToDatabase = async() => {
    if (isPrivate && !metaMaskAccount) {
      
      if (metaMaskAccount === "")
        setShowGetAccountMessage(true);
        return;
    }
    const dataToSave = {
      id: graphId,
      name: graphName,
      note: graphNote,
      data: graph.data,
      creator: graph.creator,
      private: isPrivate ? metaMaskAccount : "",
    }
    saveGraphFromProfileToDB(dataToSave, refreshList, setIsSaveGraphResponseStatusOk); 
  }    
    
  const handleDeleteGraph = async() => {
    deleteGraphFromDB(graphId!, setIsDeleteGraphResponseStatusOk);
  } 

  useEffect(() => {
    if (isDeleteGraphResponseStatusOk) {
      refreshList();
    } 
  },[isDeleteGraphResponseStatusOk])

  return (
    <>
      <StyledButton 
        aria-describedby={id} 
        onClick={handleClick}   
      >
        <DotsVerticalIcon />                       
      </StyledButton>

      <Popper id={id} open={open} anchorEl={anchorEl} >
        <ClickAwayListener onClickAway={handleClose}>
          <StyledMenuList
            id="profile-graph-menu"
            aria-labelledby="graph-button"
            onKeyDown={handleListKeyDown}
          >
            <StyledMenuItem 
              onClick={() => {
                if (canBeEditedGraph) {
                  handleClose(); 
                  setOpenEditGraphDialog(true);
                  setGraphStatus('edited')
                }  
              }}
              sx={{
                color: canBeEditedGraph ? '' : THEME_COLORS.get('lightGray'), 
                cursor: canBeEditedGraph ? '' : 'auto'
              }}
            >
              Edit graph info
            </StyledMenuItem>
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
              Duplicate
            </StyledMenuItem>
            <StyledMenuItem 
              onClick={() => {
                if (canBeSharedGraph) {
                  handleClose(); 
                  saveGraphToDatabase();
                  setOpenShareGraphDialog(true);
                  setGraphStatus('shared')
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
            {/* <StyledMenuItem 
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
            </StyledMenuItem> */}
            <StyledMenuItem 
              onClick={() => {
                handleClose(); 
                setIsPrivate(false); 
                setOpenSaveGraphDialog(true);
                setGraphStatus('saved as new')
              }}
            >
              Make private
            </StyledMenuItem>
            <StyledDivider />
            <StyledMenuItem 
              onClick={() => {
                if (canBeDeletedGraph) {
                  handleClose(); 
                  setOpenDeleteGraphDialog(true);
                  setGraphStatus('deleted')
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

      <EditGraphDialog
        open={openEditGraphDialog} 
        setOpen={setOpenEditGraphDialog}
        saveGraphToDatabase={saveGraphToDatabase}
        closeBar={null}
        setIsMessageWindowOpen={setIsMessageWindowOpen}
        canBePrivateGraph={canBePrivateGraph}
      />

      {/* <SaveGraphDialog
        open={openSaveGraphDialog} 
        setOpen={setOpenSaveGraphDialog}
        saveGraphToDatabase={saveGraphToDatabase}
        closeBar={closeBar}
        setIsMessageWindowOpen={setIsMessageWindowOpen}
      /> */}

     

      {/* <ShareGraphDialog
        open={openShareGraphDialog} 
        setOpen={setOpenShareGraphDialog}
        setIsShareGraphResponseStatusOk={setIsShareGraphResponseStatusOk}
        closeBar={closeBar}
        setIsMessageWindowOpen={setIsMessageWindowOpen}
      /> */}

      <DeleteGraphDialog
        open={openDeleteGraphDialog} 
        setOpen={setOpenDeleteGraphDialog}
        onDelete={handleDeleteGraph}
        closeBar={null}
        setIsMessageWindowOpen={setIsMessageWindowOpen}
      />

      <ShowGetAccountDialog 
        showGetAccountMessage={showGetAccountMessage} 
        setShowGetAccountMessage={setShowGetAccountMessage} 
      />
     
      {/* {isSaveGraphResponseStatusOk && isMessageWindowOpen && graphStatus === 'saved' &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Changes saved'}
          message={'All changes in your graph were saved.'}
        />
      }  */}
      {/* {isSaveGraphResponseStatusOk && isMessageWindowOpen && graphStatus === 'saved as new' &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Graph saved'}
          message={'You have saved your graph.'}
        />
      }  */}
      {isSaveGraphResponseStatusOk && isMessageWindowOpen && graphStatus === 'edited' &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Graph info edited'}
          message={'You have edited your graph info.'}
        />
      } 
      {/* {isShareGraphResponseStatusOk && isMessageWindowOpen && graphStatus === 'shared' &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Graph shared'}
          message={'You have shared your graph.'}
        />
      }  */}
      {isDeleteGraphResponseStatusOk && isMessageWindowOpen && graphStatus === 'deleted' &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Graph deleted'}
          message={'You have deleted your graph.'}
        />
      } 
      {/* {isSaveGraphResponseStatusOk === false && isMessageWindowOpen && ['saved', 'saved as new'].includes(graphStatus) &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Graph not saved'}
          message={'There was an error. Please try again.'}
        />
      }  */}
      {isSaveGraphResponseStatusOk === false && isMessageWindowOpen && graphStatus === 'edited' &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Graph not edited'}
          message={'There was an error. Please try again.'}
        />
      } 
      {/* {isShareGraphResponseStatusOk === false && isMessageWindowOpen && graphStatus === 'shared' &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Graph not shared'}
          message={'There was an error. Please try again.'}
        />
      } */}
      {isDeleteGraphResponseStatusOk === false && isMessageWindowOpen && graphStatus === 'deleted' &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Graph not deleted'}
          message={'There was an error. Please try again.'}
        />
      }
    </>   
  )
}
