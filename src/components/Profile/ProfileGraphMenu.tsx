import { ClickAwayListener, Divider, MenuItem, MenuList, Popper } from '@mui/material';
import { DotsVerticalIcon, EyeClosedIcon, EyeOpenedIcon, ShareIcon } from 'assets/icons/svg';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { THEME_COLORS } from "constants/colors";
import { deleteGraphFromDB, saveGraphFromProfileToDB, duplicateGraphToDB } from 'components/networkFunctions';
import GraphMenuMessage from 'components/GraphMenuMessage';
import functionalGraphData from "functions/functionalGraphIds.json"; 
import EditGraphDialog from "components/Dialog/EditGraphDialog";
import ShareGraphDialog from "components/Dialog/ShareGraphDialog";
import MakeGraphPublicDialog from 'components/Dialog/MakeGraphPublicDialog';
import DeleteGraphDialog from "components/Dialog/DeleteGraphDialog";
import ShowGetAccountDialog from 'components/Dialog/ShowGetAccountDialog';
import { useGraphStore } from 'store/GraphStore';
import { useShallow } from 'zustand/react/shallow'
import { useMetaMaskAccountStore } from 'store/MetaMaskAccountStore';
import { Graph } from "models";
import { useParams } from 'react-router-dom';
import { useAllGraphsStore } from 'store/AllGraphsStore';
import MakeGraphPrivateDialog from 'components/Dialog/MakeGraphPrivateDialog';

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
  currentTab: number;
};
type GraphStatus = 'duplicated' | 'changed status' | 'edited' | 'shared' | 'deleted' | 'null';

export default function ProfileGraphMenu({ graph, currentTab }: GraphProps) {
  const [graphName, graphNote, isPrivate, graphId, setGraphName, setGraphNote, setIsPrivate, setGraphId, setPrevGraphName, setPrevGraphNote, setPrevGraphPrivate] = useGraphStore(
    useShallow((state) => [
      state.graphName, 
      state.graphNote,
      state.isPrivate,
      state.graphId,
      state.setGraphName,
      state.setGraphNote,
      state.setIsPrivate,
      state.setGraphId,
      state.setPrevGraphName, 
      state.setPrevGraphNote,
      state.setPrevGraphPrivate,
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
  const [isDuplicateGraphResponseStatusOk, setIsDuplicateGraphResponseStatusOk] = useState<boolean | null>(null);
  const [isShareGraphResponseStatusOk, setIsShareGraphResponseStatusOk] = useState<boolean | null>(null);
  const [isDeleteGraphResponseStatusOk, setIsDeleteGraphResponseStatusOk] = useState<boolean | null>(null);
  const [graphStatus, setGraphStatus] = useState<GraphStatus>('null');
  const [openEditGraphDialog, setOpenEditGraphDialog] = useState(false);
  const [openShareGraphDialog, setOpenShareGraphDialog] = useState(false);
  const [openMakeGraphPublicDialog, setOpenMakeGraphPublicDialog] = useState(false);
  const [openMakeGraphPrivateDialog, setOpenMakeGraphPrivateDialog] = useState(false);
  const [openDeleteGraphDialog, setOpenDeleteGraphDialog] = useState(false);
  const [showGetAccountMessage, setShowGetAccountMessage] = useState(false);
  const [isMessageWindowOpen, setIsMessageWindowOpen] = useState(false);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;
  
  const canBeEditedGraph = !functionalGraphData.hasOwnProperty(graph.id!);
  const canBeDuplicatedGraph = !functionalGraphData.hasOwnProperty(graph.id!) && metaMaskAccount;
  const canBeSharedGraph = !functionalGraphData.hasOwnProperty(graph.id!);
  const canBeDeletedGraph = (metaMaskAccount && graph.creator === metaMaskAccount) || isPrivate;
  const canBePrivateGraph = graph.creator === metaMaskAccount && !functionalGraphData.hasOwnProperty(graph.id!);

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
      setIsDuplicateGraphResponseStatusOk(null);
    }    
  },[open, anchorEl]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setGraphName(graph.name);
    setGraphNote(graph.note);
    setIsPrivate(graph.private !== '');
    setPrevGraphName(graph.name);
    setPrevGraphNote(graph.note);
    setPrevGraphPrivate(graph.private !== '');
    setGraphId(graph.id!);
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
      name: graphName === graph.name ? null : graphName,
      note: graphNote === graph.note ? null : graphNote,
      data: null,
      creator: null,
      private: isPrivate ? metaMaskAccount : "",
    }
    saveGraphFromProfileToDB(dataToSave, refreshList, setIsSaveGraphResponseStatusOk); 
  }    

  const duplicateGraph = async() => {

    if (metaMaskAccount === ""){
        setShowGetAccountMessage(true);
        return;
    }

    const dataToSave = {
      name: `${graph.name} (copy)`,
      note: graph.note,
      data: graph.data,
      creator: metaMaskAccount,
      private: currentTab === 0 ? "" : metaMaskAccount,
    }
    duplicateGraphToDB(dataToSave, refreshList, setIsDuplicateGraphResponseStatusOk); 
    setIsMessageWindowOpen(true);
  } 
    
  const handleDeleteGraph = async() => {
    deleteGraphFromDB(graphId!, setIsDeleteGraphResponseStatusOk);
  } 

  useEffect(() => {
    if (isDeleteGraphResponseStatusOk || isShareGraphResponseStatusOk) {
      refreshList();
    } 
  },[isDeleteGraphResponseStatusOk, isShareGraphResponseStatusOk])

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
                if (canBeDuplicatedGraph) {
                  handleClose(); 
                  duplicateGraph();
                  setGraphStatus('duplicated')
                }  
              }}
              sx={{
                color: canBeDuplicatedGraph ? '' : THEME_COLORS.get('lightGray'), 
                cursor: canBeDuplicatedGraph ? '' : 'auto'
              }}
            >
              Duplicate
            </StyledMenuItem>
            <StyledMenuItem 
              onClick={() => {
                if (canBeSharedGraph) {
                  handleClose(); 
                  setOpenShareGraphDialog(true);
                  setGraphStatus('shared')
                }                
              }}
              sx={{
                display:'flex', 
                gap:'8px',
                color: canBeSharedGraph ? '' : THEME_COLORS.get('lightGray'), 
                cursor: canBeSharedGraph ? '' : 'auto'
              }}            
            >
              <ShareIcon />
              Share
            </StyledMenuItem>
            {currentTab === 0 &&
              <>
                <StyledDivider />
                <StyledMenuItem 
                  onClick={() => {
                    if (canBePrivateGraph) {
                      handleClose(); 
                      setOpenMakeGraphPrivateDialog(true);
                      setGraphStatus('changed status')
                      setIsPrivate(true); 
                    }                    
                  }}
                  sx={{
                    display:'flex', 
                    gap:'8px',
                    color: canBePrivateGraph ? '' : THEME_COLORS.get('lightGray'), 
                    cursor: canBePrivateGraph ? '' : 'auto'
                  }}
                >
                  <EyeClosedIcon />
                  Make private
                </StyledMenuItem>
              </>              
            }
            {currentTab === 1 &&
              <>
                <StyledDivider />
                <StyledMenuItem 
                  onClick={() => {
                    handleClose(); 
                    setOpenMakeGraphPublicDialog(true);
                    setGraphStatus('changed status')
                    setIsPrivate(false);
                  }}
                  sx={{display:'flex', gap:'8px'}}
                >
                  <EyeOpenedIcon />
                  Make public
                </StyledMenuItem>
              </>              
            }
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

      <ShareGraphDialog
        open={openShareGraphDialog} 
        setOpen={setOpenShareGraphDialog}
        setIsShareGraphResponseStatusOk={setIsShareGraphResponseStatusOk}
        closeBar={null}
        setIsMessageWindowOpen={setIsMessageWindowOpen}
      />

      <MakeGraphPrivateDialog
        open={openMakeGraphPrivateDialog} 
        setOpen={setOpenMakeGraphPrivateDialog}
        saveGraphToDatabase={saveGraphToDatabase}
        setIsMessageWindowOpen={setIsMessageWindowOpen}
      />
      <MakeGraphPublicDialog
        open={openMakeGraphPublicDialog} 
        setOpen={setOpenMakeGraphPublicDialog}
        saveGraphToDatabase={saveGraphToDatabase}
        setIsMessageWindowOpen={setIsMessageWindowOpen}
      />

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
     
      {isDuplicateGraphResponseStatusOk && isMessageWindowOpen && graphStatus === 'duplicated' &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Graph duplicated'}
          message={'The graph was successfully duplicated.'}
        />
      } 
      {isSaveGraphResponseStatusOk && isMessageWindowOpen && graphStatus === 'edited' &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Graph info edited'}
          message={'You have edited your graph info.'}
        />
      } 
      {isShareGraphResponseStatusOk && isMessageWindowOpen && graphStatus === 'shared' &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Graph shared'}
          message={'You have shared your graph.'}
        />
      } 
      {isDeleteGraphResponseStatusOk && isMessageWindowOpen && graphStatus === 'deleted' &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Graph deleted'}
          message={'You have deleted your graph.'}
        />
      } 
      {isSaveGraphResponseStatusOk === false && isMessageWindowOpen && ['changed status'].includes(graphStatus) &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Changes were not made'}
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
      {isShareGraphResponseStatusOk === false && isMessageWindowOpen && graphStatus === 'shared' &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Graph not shared'}
          message={'There was an error. Please try again.'}
        />
      }
      {isDeleteGraphResponseStatusOk === false && isMessageWindowOpen && graphStatus === 'deleted' &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Graph not deleted'}
          message={'There was an error. Please try again.'}
        />
      }
      {isDuplicateGraphResponseStatusOk === false && isMessageWindowOpen && graphStatus === 'duplicated' &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Graph not duplicated'}
          message={'There was an error. Please try again.'}
        />
      }
    </>   
  )
}