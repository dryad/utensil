import { useEffect } from "react";
import { Button, Avatar } from "@mui/material";
import { THEME_COLORS } from "constants/colors";
import { useMetaMaskAccountStore } from "store/MetaMaskAccountStore";
import { useShallow } from "zustand/react/shallow";

export default function MetaMaskButton() {

  const [address, getMetaMaskAccount, getAddress] = useMetaMaskAccountStore(
    useShallow((state) => [
      state.address,
      state.getMetaMaskAccount,
      state.getAddress
    ])
  );
   
  const shortenAddress = (address: string) => {
    // display the first 9 characters of the address, then "..." then the last 3 characters
    const first = address.slice(0, 9).toLowerCase();
    const last = address.slice(-3).toLowerCase();
    return `${first}...${last}`;
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      getAddress(window.ethereum.selectedAddress);
    }      
  }, []);

  return (
      <>
        {window.ethereum &&
          <div
            style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', padding: '4px 15px'}}
          > 
            {window.ethereum.isMetaMask && !window.ethereum.selectedAddress && (
              <>
                <Avatar sx={{width: '36px', height: '36px', color: 'white', bgcolor: THEME_COLORS.get('darkGray')}}>A</Avatar>
                <Button 
                  onClick={() => getMetaMaskAccount()} 
                  variant="outlined" 
                  sx={{'borderColor': THEME_COLORS.get('blue'), 'borderRadius': '10px', color: THEME_COLORS.get('blue'), textTransform: 'none'}}
                >
                  Connect Wallet
                </Button>
              </>                
            )}
            {window.ethereum.isMetaMask && window.ethereum.selectedAddress && (
              <>
                {address?.avatar_url &&
                  <Avatar sx={{width: '36px', height: '36px'}} src={address?.avatar_url} />
                }
                {!address?.avatar_url &&
                  <Avatar sx={{width: '36px', height: '36px', bgcolor: THEME_COLORS.get('blue'), fontSize:'1rem', fontWeight:'500' }} >
                    { address?.name == undefined ? null : address.name[0]}
                  </Avatar> 
                }                
                {shortenAddress(window.ethereum.selectedAddress)}
              </>   
                          
            )}
          </div>
        }
        
        {!window.ethereum && (
          <Button
            href="https://metamask.io/" 
            variant="outlined" 
            sx={{'borderColor': THEME_COLORS.get('blue'), 'borderRadius': '10px', color: THEME_COLORS.get('blue'), textTransform: 'none'}}
          >
            Get MetaMask to Connect
          </Button>            
        )}
      </>        
  )
}