import React, { useCallback, useEffect } from "react";
import { IconButton, Box, Stack } from "@mui/material";
import { Undo, Redo, PanTool, Circle, ArrowRightAlt, Minimize, HighlightOff } from "@mui/icons-material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import makeStyles from '@mui/styles/makeStyles';

export default function NetworkButtons(props) {
    
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
                    </ToggleButtonGroup>
                </Box>
            </Stack>
        </div>
    )
}