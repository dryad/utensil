import { useEffect, useState } from "react";
import {useParams, useNavigate} from "react-router-dom";
import EmptyProfilePopUp from 'components/EmptyProfilePopUp';
import ProfileInfo from 'components/ProfileInfo';
import Navbar from "layout/Navbar";
import WhitelistedAddresses from "components/WhitelistedAddresses";
import { useMetaMaskAccountStore } from "store/MetaMaskAccountStore";
import { useAllGraphsStore } from 'store/AllGraphsStore';
import { useShallow } from "zustand/react/shallow";
import { Button } from "@mui/material";
import { THEME_COLORS } from "constants/colors";
import styled from "@emotion/styled";
import ProfileMenuBar from 'components/ProfileMenuBar';
import ProfileGraphsContainer from 'components/ProfileGraphsContainer';

const StyledButton = styled(Button)(() => ({
    backgroundColor: THEME_COLORS.get('blue'), 
    height: '50px', 
    color: 'white', 
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: '500'
  }));
  
function Profile() {
    let navigate = useNavigate();
    const { addressId } = useParams() // the addressId parameter from the URL
    const [currentTab, setCurrentTab] = useState(0);

    const [metaMaskAccount, getAddress, can_edit_profile] = useMetaMaskAccountStore(
        useShallow((state) => [
          state.metaMaskAccount,
          state.getAddress,
          state.can_edit_profile
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

    useEffect(() => {
        getPublicGraphs();
    },[getPublicGraphs]);

    useEffect(() => {
        if (can_edit_profile()) {
            getPrivateGraphs(addressId!);
        } 
    },[metaMaskAccount, addressId]);

    useEffect(() => {
        if (can_edit_profile()) {
            getSharedGraphs(addressId!);
        } 
    },[metaMaskAccount, addressId]);

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
    },[addressId]);  
        
    const address_is_whitelisted = () => {
        return WhitelistedAddresses.includes(metaMaskAccount);
      }
   
    return (
        <>
            <nav>
                <Navbar />
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
                                width: '300px'
                            }}
                        >
                            <ProfileInfo />
                            <StyledButton variant="contained">
                                + Create new graph
                            </StyledButton>
                        </div>
                        <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                            <div style={{fontSize:"1.75rem", fontWeight:'500', color: THEME_COLORS.get('black')}}>
                                Graphs
                            </div>
                            <ProfileMenuBar 
                                currentTab={currentTab}
                                setCurrentTab={setCurrentTab}
                            />
                            <ProfileGraphsContainer 
                                currentTab={currentTab}
                            />
                        </div>
                    </div>                    
                }
            </main>
        </>
    );
}

export default Profile;
