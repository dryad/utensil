import { useEffect } from "react";
import {useParams, useNavigate} from "react-router-dom";
import EmptyProfilePopUp from 'components/EmptyProfilePopUp';
import ProfileInfo from 'components/Profile/ProfileInfo';
import Navbar from "layout/Navbar";
import WhitelistedAddresses from "components/WhitelistedAddresses";
import { useMetaMaskAccountStore } from "store/MetaMaskAccountStore";
import { useAllGraphsStore } from 'store/AllGraphsStore';
import { useProfileGraphsTabStore } from 'store/ProfileGraphsTabStore';
import { useUtensilModalStore } from 'store/UtensilModalStore';
import { useShallow } from "zustand/react/shallow";
import { Button, Drawer } from "@mui/material";
import { THEME_COLORS } from "constants/colors";
import ProfileMenuBar from 'components/Profile/ProfileMenuBar';
import ProfileGraphsContainer from 'components/Profile/ProfileGraphsContainer';
import { useAllUsersStore } from 'store/AllUsersStore';
import Utensil from "./Utensil";
import { Graph } from "models";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        background: {
            default: THEME_COLORS.get('bg')
          },
        contrastThreshold: 3,
        tonalOffset: 0.2,
    }
});

const StyledButton = styled(Button)(() => ({
    backgroundColor: THEME_COLORS.get('blue'), 
    height: '50px', 
    color: 'white', 
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: '500'
  }));

  const ScrollBox = styled('div')(() => ({
    flex: '1',
    overflowY:'auto', 
    '&::-webkit-scrollbar':{
      width: '7px',
      },
    '&::-webkit-scrollbar-thumb': {
          background: THEME_COLORS.get('lightGray'),    
          borderRadius: '20px',
          '&:hover': {
              background: THEME_COLORS.get('gray')     
          }
      }  
  }))
  
function Profile() {
    let navigate = useNavigate();
    const { addressId } = useParams() // the addressId parameter from the URL
        
    const [currentTab] = useProfileGraphsTabStore(
        useShallow((state) => [
            state.currentTab,
        ])
    );

    const [metaMaskAccount, address, getAddress] = useMetaMaskAccountStore(
        useShallow((state) => [
          state.metaMaskAccount,
          state.address,
          state.getAddress
        ])
      );

    const [publicGraphs, privateGraphs, sharedGraphs, getPublicGraphs, getPrivateGraphs, getSharedGraphs] = useAllGraphsStore(
        useShallow((state) => [
            state.publicGraphs,
            state.privateGraphs,
            state.sharedGraphs,
            state.getPublicGraphs,
            state.getPrivateGraphs,
            state.getSharedGraphs
        ])
    );

    const [openUtensilModal, setOpenUtensilModal, setSelectedGraph] = useUtensilModalStore(
        useShallow((state) => [
          state.openUtensilModal,
          state.setOpenUtensilModal,
          state.setSelectedGraph
        ])
    );

    const [getAllUsers] = useAllUsersStore(
        useShallow((state) => [
            state.getAllUsers
        ])
    );

    useEffect(() => {
        getAllUsers()
    },[])

    const can_edit_profile = () => {
        return metaMaskAccount === address?.address;
    }

    useEffect(() => {
        getPublicGraphs();
    },[getPublicGraphs]);

    useEffect(() => {
        if (can_edit_profile()) {
            getPrivateGraphs(addressId!);
        } 
    },[metaMaskAccount, addressId, address]);

    useEffect(() => {
        if (can_edit_profile()) {
            getSharedGraphs(addressId!);
        } 
    },[metaMaskAccount, addressId, address]);

    useEffect(() => {
        if (!openUtensilModal) {
            refreshGraphLists();
          }
    },[openUtensilModal])

    const refreshGraphLists = async () => {
        getPublicGraphs();
        getPrivateGraphs(addressId!);
        getSharedGraphs(addressId!);
    }

    console.log(publicGraphs, '====public');
    console.log(privateGraphs, '===private');
    console.log(sharedGraphs, '===shared');

    useEffect(() => {
        if (addressId) {
            getAddress(addressId);
            navigate(`/profile/${addressId}`);
        } else {
            if (metaMaskAccount) {
                navigate(`/profile/${metaMaskAccount}`);
            }
        }
    },[addressId, metaMaskAccount]); 
    
    const toggleDrawer =
    (open: boolean, graph: Graph | null) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
       
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
              (event as React.KeyboardEvent).key === 'Shift')
          ) {
            return;
        }
        setSelectedGraph(graph);
        setOpenUtensilModal(open);
    };
        
    const address_is_whitelisted = () => {
        return WhitelistedAddresses.includes(metaMaskAccount);
      }
   
    return (
        <>
            <nav>
                <Navbar page={'profile'} />
            </nav>
            <main style={{ width: '100%', flex: '1 1 auto' }}>
                {addressId === undefined &&
                    <div 
                        style={{position:'absolute', left:'50%', top:'50%', transform: 'translate(-50%, -50%)'}}
                    >
                        <EmptyProfilePopUp />
                    </div>
                }
                {addressId !== undefined &&
                    <div
                        style={{
                            display: 'flex',
                            height: '100%',
                            paddingTop:'8px',
                            gap: '16px'
                        }}
                    >
                        <div 
                            style={{
                                display:'flex',
                                flexDirection:'column',
                                justifyContent:'space-between',
                                minWidth: '300px'
                            }}
                        >
                            <ProfileInfo />
                            {can_edit_profile() && 
                                <StyledButton variant="contained" onClick={toggleDrawer(true, null)}>
                                    + Create new graph
                                </StyledButton>
                            }                            
                        </div>
                        <ThemeProvider theme={theme}>
                            <Drawer
                                anchor={"right"}
                                open={openUtensilModal}
                                onClose={toggleDrawer(false, null)}
                                hideBackdrop={true}
                                transitionDuration={500}
                            >
                                <div 
                                    style={{
                                        width: `calc(100vw - 332px)`,
                                        padding: '0.5rem 1rem 1rem',
                                        backgroundColor: THEME_COLORS.get('bg'),
                                        height: '100vh',
                                        overflowY: 'auto'
                                    }}
                                >
                                    <Utensil />
                                </div>  
                            </Drawer>                                 
                        </ThemeProvider>  
                        <div style={{width:'100%', display:'flex', flexDirection:'column', gap:'20px'}}>
                            <div style={{height: '39px', fontSize:"1.75rem", fontWeight:'500', color: THEME_COLORS.get('black')}}>
                                Graphs
                            </div>
                            <div style={{height:"36px"}}>
                                <ProfileMenuBar />
                            </div>
                            <ScrollBox>
                                <ProfileGraphsContainer currentTab={currentTab} />
                            </ScrollBox>                           
                        </div>
                    </div>                    
                }
            </main>
        </>
    );
}

export default Profile;
