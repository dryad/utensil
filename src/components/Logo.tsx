import { Box } from "@mui/material";
import { LogoIcon } from '../assets/icons/svg';
import { THEME_COLORS } from "constants/colors";

function Logo() {
  return (
    <Box 
        sx={{
            width:'55px', 
            height:'55px', 
            borderRadius: '50%', 
            bgcolor: THEME_COLORS.get("white"), 
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