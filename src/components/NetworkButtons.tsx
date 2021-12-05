import React from "react";
import { IconButton, Box } from "@mui/material";
import { Undo, Redo, Circle, ArrowRightAlt, Minimize } from "@mui/icons-material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function NetworkButtons() {
    const [view, setView] = React.useState('list');

    const handleChange = (event: React.MouseEvent<HTMLElement>, nextView: string) => {
        setView(nextView);
    };
    return(
        <div>
            <Box m={1}>
            <IconButton aria-label="Undo">
                <Undo/>
            </IconButton>
            <IconButton aria-label="Redo">
                <Redo/>
            </IconButton>
            </Box>
            <ToggleButtonGroup
                orientation="vertical"
                value={view}
                exclusive
                onChange={handleChange}
                >
                <ToggleButton value="node" aria-label="node">
                    <IconButton aria-label="Node">
                        <Circle/>
                    </IconButton>
                </ToggleButton>
                <ToggleButton value="directed-edge" aria-label="directed-edge">
                    <IconButton aria-label="Directed Edge">
                        <ArrowRightAlt style={{'transform': 'rotate(-45deg)'}}/>
                    </IconButton>
                </ToggleButton>
                <ToggleButton value="edge" aria-label="edge">
                    <IconButton aria-label="Undirected Edge">
                        <Minimize style={{'transform': 'translate(-7px, -5px) rotate(-45deg)'}}/>
                    </IconButton>
                </ToggleButton>
            </ToggleButtonGroup>
      </div>
    )
}