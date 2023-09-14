import { Box } from "@mui/material";
import { LogoIcon } from '../assets/icons/svg';

function Logo() {
  return (
    <Box 
        sx={{
            width:'55px', 
            height:'55px', 
            borderRadius: '50%', 
            bgcolor:'white', 
            display:'flex', 
            justifyContent:'center',
            alignItems:'center'
        }}
    >
        <LogoIcon />
    </Box>
  )
}

export default Logo