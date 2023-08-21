import React, { useCallback, useEffect, useState } from "react";
import { IconButton, Box, Stack, Icon } from "@mui/material";
import { Undo, Redo, PanTool, Circle, ArrowRightAlt, Minimize, HighlightOff, ChangeHistory, Functions } from "@mui/icons-material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import makeStyles from '@mui/styles/makeStyles';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const options = [
  'addition',
  'subtraction',
  'multiplication',
  'division',
  'exponentiation',  
];

const icons = [
    <Icon sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>+</Icon>,
    <Icon sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>-</Icon>,
    <Icon sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>*</Icon>,
    <Icon sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>/</Icon>,
    <Icon sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>^</Icon>,  
  ];

const ITEM_HEIGHT = 48;

export default function NetworkButtons(props: any) {
    
    const escFunction = useCallback((event) => {
        if(event.keyCode === 27) { //Escape key
            setPanMode();
        }
    }, []);
    const setPanMode = () => {
        props.onButton('pan');
    }
    const handleChange = (event: React.MouseEvent<HTMLElement>, nextMode: string) => {
        if (nextMode !== null) { //disallow unselecting an item. 
            props.onButton(nextMode); // Tell Utensil.tsx to change the button mode
        }
    };
    const useStyles = makeStyles((theme) => ({
        selected: {
          "&&": {
            backgroundColor: '#cccccc',
          }
        }
    }));
    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
    
        return () => {
          document.removeEventListener("keydown", escFunction, false);
        };
    }, []);
    const classes = useStyles();

    const [functionIconIdx, setFunctionIconIdx] = useState(-10);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return(
        <div>
            <Stack direction="column" spacing={1}>
                <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton
                        aria-label="Undo"
                        disabled={props.undoDisabled}
                        onClick={() => props.onUndo()}
                    >
                        <Undo />
                    </IconButton>
                    <IconButton
                        aria-label="Redo"
                        disabled={props.redoDisabled}
                        onClick={() => props.onRedo()}
                    >
                        <Redo />
                    </IconButton>
                </Stack>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center">
                    <ToggleButtonGroup
                        style={{ 'marginBottom': 10 }}
                        orientation="vertical"
                        value={props.buttonMode} // The value of the selected button comes from Utensil.tsx as a React prop
                        exclusive
                        onChange={handleChange}

                    >
                        <ToggleButton value="pan" aria-label="pan" classes={{ selected: classes.selected }}>
                            <IconButton aria-label="Pan">
                                <PanTool />
                            </IconButton>
                        </ToggleButton>
                        <ToggleButton value="node" aria-label="node" classes={{ selected: classes.selected }}>
                            <IconButton aria-label="Node">
                                <Circle />
                            </IconButton>
                        </ToggleButton>
                        <ToggleButton value="directed-edge" aria-label="directed-edge" classes={{ selected: classes.selected }}>
                            <IconButton aria-label="Directed Edge">
                                <ArrowRightAlt style={{ 'transform': 'rotate(-45deg)' }} />
                            </IconButton>
                        </ToggleButton>
                        <ToggleButton value="edge" aria-label="edge" classes={{ selected: classes.selected }}>
                            <IconButton aria-label="Undirected Edge">
                                <Minimize style={{ 'transform': 'translate(-7px, -5px) rotate(-45deg)' }} />
                            </IconButton>
                        </ToggleButton>
                        <ToggleButton value="delete" aria-label="delete" classes={{ selected: classes.selected }}>
                            <IconButton aria-label="Delete">
                                <HighlightOff color="error" />
                            </IconButton>
                        </ToggleButton>
                        <ToggleButton value="expansion" aria-label="expansion" classes={{ selected: classes.selected }}>
                            <IconButton aria-label="Expansion">
                                <ChangeHistory style={{ 'transform': 'rotate(-90deg)' }} />
                            </IconButton>
                        </ToggleButton>
                        <ToggleButton value="contraction" aria-label="contraction" classes={{ selected: classes.selected }}>
                            <IconButton aria-label="Contraction">
                                <ChangeHistory style={{ 'transform': 'rotate(90deg)' }} />
                            </IconButton>
                        </ToggleButton>
                        <ToggleButton 
                            onClick={handleClick} 
                            value="functions" 
                            aria-label="functions" 
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            selected={!['pan', 'node', 'directed-edge', 'edge', 'delete', 'expansion', 'contraction'].includes(props.buttonMode)}
                            classes={{ selected: classes.selected }}
                        >
                            <IconButton aria-label="Functions">
                                <Functions />
                            </IconButton>
                            <div style={{position: 'absolute', top: '0', right: '0'}}>
                                {icons[functionIconIdx]}
                            </div>                            
                        </ToggleButton>
                        <Menu
                            id="long-menu"
                            MenuListProps={{
                            'aria-labelledby': 'long-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                            PaperProps={{
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                margin: '0 0 0 0.2rem'
                            },
                            }}
                        >
                            {options.map((option, index) => (
                                <MenuItem 
                                    key={option} 
                                    sx={{display: 'flex', justifyContent: 'space-between'}}
                                    onClick={(event) => {handleChange(event, option); setFunctionIconIdx(index); handleClose()}}
                                >
                                    {option}
                                    {icons[index]}
                                </MenuItem>
                            ))}
                        </Menu>
                    </ToggleButtonGroup>
                </Box>
            </Stack>
        </div>
    )
}