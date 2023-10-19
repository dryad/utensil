import { useEffect } from "react";
import {useParams, useNavigate} from "react-router-dom";
import EmptyProfilePopUp from 'components/EmptyProfilePopUp';
import Navbar from "layout/Navbar";
import WhitelistedAddresses from "components/WhitelistedAddresses";
import { useMetaMaskAccountStore } from "store/MetaMaskAccountStore";
import { useShallow } from "zustand/react/shallow";

function Profile() {
    let navigate = useNavigate();
    const { addressId } = useParams() // the addressId parameter from the URL
    const [metaMaskAccount] = useMetaMaskAccountStore(
        useShallow((state) => [
          state.metaMaskAccount
        ])
      );
   
console.log(addressId === undefined, addressId, typeof addressId)
        
    useEffect(() => {
        if (metaMaskAccount) {
            navigate(`/profile/${metaMaskAccount}`);
        }
    },[metaMaskAccount])    

    const shortenAddress = (address: string) => {
        // display the first 6 characters of the address, then "..." then the last 4 characters
        const first = address.slice(0, 6);
        const last = address.slice(-4);
        return `${first}...${last}`;
    }

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
                    <div>
                        Profile page
                    </div>
                }
            </main>
        </>
    );
}

export default Profile;