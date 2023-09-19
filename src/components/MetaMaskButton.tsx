import { useEffect, useState } from "react";
import { Button, Avatar } from "@mui/material";
import axios from "libs/axios";
import { THEME_COLORS } from "constants/colors";

export default function MetaMaskButton(props: any) {
    
    const [address, setAddress] = useState({}); // The address object to display
        
    const getAddress = async () => {
      if (typeof ethereum !== 'undefined') {
        const { data } = await axios.get(`/api/address/${ethereum.selectedAddress}/`);
        setAddress(data);
        console.log('metamaskbutton set address', data.avatar_url);
      }
    };
    
    const shortenAddress = (address: string) => {
      // display the first 6 characters of the address, then "..." then the last 4 characters
      const first = address.slice(0, 6).toLowerCase();
      const last = address.slice(-4).toLowerCase();
      return `${first}...${last}`;
    };

    useEffect(() => {
        getAddress();
    }, []);

    return (
        <>
          {window.ethereum &&
            <div
              style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', padding: '4px 15px'}}
            > 
              {ethereum.isMetaMask && !ethereum.selectedAddress && (
                <>
                  <Avatar sx={{width: '36px', height: '36px', color: 'white', bgcolor: THEME_COLORS.get('darkGray')}}>A</Avatar>
                  <Button 
                    onClick={props.getMetaMaskAccount} 
                    variant="outlined" 
                    sx={{'borderColor': THEME_COLORS.get('blue'), 'borderRadius': '10px', color: THEME_COLORS.get('blue'), textTransform: 'none'}}
                  >
                    Connect Wallet
                  </Button>
                </>                
              )}
              {ethereum.isMetaMask && ethereum.selectedAddress && (
                <>
                  <Avatar sx={{width: '36px', height: '36px', bgcolor: THEME_COLORS.get('blue')}} src={address.avatar_url} />
                  {shortenAddress(ethereum.selectedAddress)}
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