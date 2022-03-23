import React, { useCallback, useEffect, useState } from "react";
import { IconButton, Box, Stack, Button, Typography } from "@mui/material";
import { Undo, Redo, PanTool, Circle, ArrowRightAlt, Minimize, HighlightOff } from "@mui/icons-material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import makeStyles from '@mui/styles/makeStyles';

export default function MetaMaskButton(props) {




    return (
        <>
            {window.ethereum && ethereum.isMetaMask && !ethereum.selectedAddress && (
                <Button 
                    onClick={props.getMetaMaskAccount}
                >Connect with MetaMask</Button>
            )}
            {window.ethereum && ethereum.isMetaMask && ethereum.selectedAddress && (
                <Typography>{ethereum.selectedAddress}</Typography>
            )}
            {!window.ethereum && (
            <a href="https://metamask.io/" target="_blank">Get MetaMask to Connect</a>

            )}
        </>
        
    )
}