import { Button, Avatar } from "@mui/material";
import { THEME_COLORS } from "constants/colors";

export default function ProfileCreatorButton({creator}: {creator: string}) {
   
  const shortenAddress = (address: string) => {
    // display the first 9 characters of the address, then "..." then the last 3 characters
    const first = address.slice(0, 9).toLowerCase();
    const last = address.slice(-3).toLowerCase();
    return `${first}...${last}`;
  };

  return (
    <>
      {creator && 
        <div
          style={{
            width:'fit-content', 
            display:'flex', 
            justifyContent:'center', 
            alignItems:'center', 
            gap:'8px', 
            padding: '4px 8px', 
            border:`1px solid ${THEME_COLORS.get('gray200')}`, 
            borderRadius:'4px'
          }}
        > 
          {/* {address?.avatar_url &&
            <Avatar sx={{width: '36px', height: '36px'}} src={address?.avatar_url} />
          }
          {!address?.avatar_url &&
            <Avatar sx={{width: '36px', height: '36px', bgcolor: THEME_COLORS.get('blue'), fontSize:'1rem', fontWeight:'500' }} >
              { address?.name == undefined ? null : address.name[0]}
            </Avatar> 
          }                 */}
          <div style={{fontSize:'0.75rem', color: 'black', fontWeight:'500'}}>
            {shortenAddress(creator)}
          </div>        
        </div>      
      }    
    </>   
  )
}