import { useEffect } from "react";
import {useParams, useNavigate} from "react-router-dom";
import EmptyProfilePopUp from 'components/EmptyProfilePopUp';
import ProfileInfo from 'components/ProfileInfo';
import Navbar from "layout/Navbar";
import WhitelistedAddresses from "components/WhitelistedAddresses";
import { useMetaMaskAccountStore } from "store/MetaMaskAccountStore";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@mui/material";

function Profile() {
    let navigate = useNavigate();
    const { addressId } = useParams() // the addressId parameter from the URL
    const [metaMaskAccount, getAddress] = useMetaMaskAccountStore(
        useShallow((state) => [
          state.metaMaskAccount,
          state.getAddress
        ])
      );

    useEffect(() => {
        if (addressId) {
            getAddress(addressId);
        }
    },[addressId]);  
        
    useEffect(() => {
        if (metaMaskAccount) {
            navigate(`/profile/${metaMaskAccount}`);
        }
    },[metaMaskAccount])    

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
                            paddingTop:'8px'
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
                            <Button>
                                + Create new graph
                            </Button>
                        </div>
                        <div>
                            <div>
                                Graphs
                            </div>
                            {/* <ProfileMenuBar /> */}
                            <div>
                                graphs array
                            </div>
                        </div>
                    </div>                    
                }
            </main>
        </>
    );
}

export default Profile;
