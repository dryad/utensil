import { Avatar } from "@mui/material";
import { THEME_COLORS } from "constants/colors";

type User = {
  name: string;
  address: string;
  avatar_url: string;
}

export default function ProfileCreatorButton({creator}: {creator: User}) {
   
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
          {creator?.avatar_url &&
            <Avatar sx={{width: '24px', height: '24px'}} src={creator?.avatar_url} />
          }
          {!creator?.avatar_url &&
            <Avatar sx={{width: '22px', height: '22px', bgcolor: THEME_COLORS.get('blue'), fontSize:'1rem', fontWeight:'500' }} >
              { creator?.name == undefined ? null : creator.name[0]}
            </Avatar> 
          }                
          <div style={{fontSize:'0.75rem', color: 'black', fontWeight:'500'}}>
            {shortenAddress(creator.address)}
          </div>        
        </div>      
      }    
    </>   
  )
}