import React, { useCallback, useEffect, useState } from "react";
import { IconButton, Box, Stack, Button, Typography, Avatar } from "@mui/material";
import { Undo, Redo, PanTool, Circle, ArrowRightAlt, Minimize, HighlightOff } from "@mui/icons-material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import makeStyles from '@mui/styles/makeStyles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";
import axios from "libs/axios";
export default function MetaMaskButton(props) {
    
    let navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [address, setAddress] = useState({}); // The address object to display
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
      setAnchorEl(null);
    };
    const getAddress = async () => {
        const { data } = await axios.get(`/api/address/${ethereum.selectedAddress}/`);
        setAddress(data);
    };
    const navigateToProfile = () => {
        navigate("/profile/" + ethereum.selectedAddress);
    }
    
    const shortenAddress = (address: string) => {
        // display the first 6 characters of the address, then "..." then the last 4 characters
        const first = address.slice(0, 6);
        const last = address.slice(-4);
        return `${first}...${last}`;
    }
    useEffect(() => {
        getAddress();
    }, []);
    return (
        <>
            {window.ethereum && ethereum.isMetaMask && !ethereum.selectedAddress && (
                <Button onClick={props.getMetaMaskAccount} variant="outlined" sx={{ 'borderColor': '#2d2d2d', 'borderRadius': '10px', 'marginRight': '0%', float: "right" }}>Connect wallet</Button>
            )}
            {window.ethereum && ethereum.isMetaMask && ethereum.selectedAddress && (
                <div>
                <Button
                  variant="outlined" sx={{ 'borderColor': '#2d2d2d', 'borderRadius': '10px', float: "right" }}  
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                >
                    <Avatar sx={{width: '20px', height: '20px', 'marginRight': '5px'}} src={address.avatar_url} />
                    {shortenAddress(ethereum.selectedAddress)}
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={navigateToProfile}>View Profile</MenuItem>
                  {/* <MenuItem onClick={handleClose}>Logout</MenuItem> */}
                </Menu>
              </div>
            )}
            {!window.ethereum && (
            <a href="https://metamask.io/" target="_blank">Get MetaMask to Connect</a>
            )}


            {/* <a href={'/profile/' + ethereum.selectedAddress} target="_blank">My profile</a> */}
        </>
        
    )
}