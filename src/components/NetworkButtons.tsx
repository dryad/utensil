import React, { useCallback, useEffect } from "react";
import { IconButton, Box } from "@mui/material";
import { Undo, Redo, PanTool, Circle, ArrowRightAlt, Minimize } from "@mui/icons-material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import makeStyles from '@mui/styles/makeStyles';

export default function NetworkButtons(props) {
    const [view, setView] = React.useState('pan');
    const escFunction = useCallback((event) => {
        if(event.keyCode === 27) { //Escape key
            setPanMode();
        }
    }, []);
    const setPanMode = () => {
        props.onButton('pan');
        setView('pan');
    }
    const handleChange = (event: React.MouseEvent<HTMLElement>, nextView: string) => {
        if (nextView !== null) { //disallow unselecting an item. 
            props.onButton(nextView=nextView);
            setView(nextView);
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
            <Box m={1}>
                <IconButton 
                    aria-label="Undo"
                    disabled={props.undoDisabled}
                    onClick={() => props.onUndo()}
                >
                    <Undo/>
                </IconButton>
                <IconButton 
                    aria-label="Redo"
                    disabled={props.redoDisabled}
                    onClick={() => props.onRedo()}
                >
                    <Redo/>
                </IconButton>
            </Box>
            <Box 
              display="flex"
              justifyContent="center"
              alignItems="center">
                <ToggleButtonGroup
                    style={{'marginBottom': 10}}
                    orientation="vertical"
                    value={view}
                    exclusive
                    onChange={handleChange}
                    
                    >
                    <ToggleButton value="pan" aria-label="pan" classes={{ selected: classes.selected }}>
                        <IconButton aria-label="Node">
                            <PanTool/>
                        </IconButton>
                    </ToggleButton>
                    <ToggleButton value="node" aria-label="node" classes={{ selected: classes.selected }}>
                        <IconButton aria-label="Node">
                            <Circle/>
                        </IconButton>
                    </ToggleButton>
                    <ToggleButton value="directed-edge" aria-label="directed-edge" classes={{ selected: classes.selected }}>
                        <IconButton aria-label="Directed Edge">
                            <ArrowRightAlt style={{'transform': 'rotate(-45deg)'}}/>
                        </IconButton>
                    </ToggleButton>
                    <ToggleButton value="edge" aria-label="edge" classes={{ selected: classes.selected }}>
                        <IconButton aria-label="Undirected Edge">
                            <Minimize style={{'transform': 'translate(-7px, -5px) rotate(-45deg)'}}/>
                        </IconButton>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
      </div>
    )
}