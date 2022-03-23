import React, { useCallback, useEffect, useState } from "react";
import { IconButton, Box, Stack, Button, Typography } from "@mui/material";
import { Undo, Redo, PanTool, Circle, ArrowRightAlt, Minimize, HighlightOff } from "@mui/icons-material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import makeStyles from '@mui/styles/makeStyles';

export default function MetaMaskButton(props) {


    async function getAccount() {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        props.setMetaMaskAccount(account);
      }

    return (
        <>
            {!ethereum.selectedAddress && (
                <Button 
                    onClick={getAccount}
                >Connect with MetaMask</Button>
            )}
            {ethereum.selectedAddress && (
                <Typography>{ethereum.selectedAddress}</Typography>
            )}
        </>
        
    )
}