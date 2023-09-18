import React from "react";
import { Stack, Tooltip, TooltipProps, tooltipClasses } from "@mui/material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import VisCustomNetwork from "libs/vis-custom-network";
import { THEME_COLORS } from "constants/colors";
import { HandIcon, CursorIcon, CircleIcon, ArrowTopRightIcon, TextIcon, ContractionIcon, ExpansionIcon, UndoIcon, RedoIcon } from '../assets/icons/svg';
import { styled } from '@mui/material/styles';
import { useKeyDownHandler } from '../hooks/useKeyDownHandler';

type Props = {
    networkRef: React.MutableRefObject<VisCustomNetwork | null>;
    onButton: (nextMode: string) => void;
    undoDisabled: boolean;
    redoDisabled: boolean;
    onUndo: () => void;
    onRedo: () => void;
    buttonMode: string;
}

export default function NetworkButtons(props: Props) {
    const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
        height: '47px',
        width: '47px',
        background: 'white', 
        color: THEME_COLORS.get("darkGray"),
        border: 'none',
        borderRadius: '4px',
        padding: '5px',
        ':hover': {
            border: 'none',
            borderRadius: '4px',
            background: THEME_COLORS.get("blue"),
            color: 'white'
        },
        ':hover&.Mui-selected': {
            border: 'none',
            borderRadius: '4px',
            backgroundColor: THEME_COLORS.get("blue"),
            color: 'white'
        },
        '&.Mui-selected': {
            border: 'none',
            borderRadius: '4px',
            backgroundColor: THEME_COLORS.get("blue"),
            color: 'white'
        },  
        '&.Mui-disabled': {
            border: 'none',
            borderRadius: '4px',
        },       
    }))

    const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
        padding: '4px',
        backgroundColor: 'white',
        display: 'flex',
        gap: '2px',
        '.MuiToggleButtonGroup-grouped:not(:last-of-type)': {
            borderRadius: '4px',
        },
        '.MuiToggleButtonGroup-grouped:not(:first-of-type)': {
            borderRadius: '4px',
        },
    }));

    const StyledActionToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
        padding: '4px',
        backgroundColor: 'white',
        display: 'flex',
        gap: '2px',
    }));

    const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
      ))({
        [`& .${tooltipClasses.tooltip}`]: {
          backgroundColor: 'white',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          color: 'gray',
          position: 'relative',
          right: '4px'
        },
        [`& .${tooltipClasses.arrow}`]: {
            color: 'white',            
        },       
    });
    
    const handleChange = (event: React.MouseEvent<HTMLElement>, nextMode: string) => {
        if (nextMode !== null) { //disallow unselecting an item. 
            props.onButton(nextMode); // Tell Utensil.tsx to change the button mode
        }
    };
   
    useKeyDownHandler(props.onButton);

    const Wire = ({ children, ...props }: any) => children(props);

    const tooltipStyles = {
        background: THEME_COLORS.get("darkGray"), 
        padding: '2px 4px',
        height:'20px', 
        borderRadius:'4px', 
        color:'white', 
        display:'flex', 
        justifyContent:'center', 
        alignItems:'center',
        fontSize:'12px'
    }
    
    return(
        <div>
            <Stack direction="column" spacing={1}>
                <StyledToggleButtonGroup
                    orientation="vertical"
                    value={props.buttonMode} // The value of the selected button comes from Utensil.tsx as a React prop
                    exclusive
                    onChange={handleChange}
                >
                    <Wire value="pan" >
                        {(props:any) => (
                            <StyledTooltip placement="right" arrow 
                                title={
                                    <div style={{display:'flex', alignItems:"center", gap:'4px'}}>
                                        <span>Hand tool</span>
                                        <div style={tooltipStyles}>
                                            H
                                        </div>
                                    </div>
                                }
                            >
                                <StyledToggleButton aria-label="pan" {...props}>
                                    <HandIcon />
                                </StyledToggleButton>
                            </StyledTooltip>
                        )}
                    </Wire>
                    <Wire value="select" >
                        {(props:any) => (
                            <StyledTooltip placement="right" arrow 
                                title={
                                    <div style={{display:'flex', alignItems:"center", gap:'4px'}}>
                                        <span>Select</span>
                                        <div style={tooltipStyles}>
                                            S
                                        </div>
                                    </div>
                                }
                            >
                                <StyledToggleButton aria-label="select" {...props}>
                                    <CursorIcon />
                                </StyledToggleButton>
                            </StyledTooltip>
                        )}
                    </Wire>
                    <StyledToggleButton value="node" aria-label="node">
                        <CircleIcon />
                    </StyledToggleButton>
                    <StyledToggleButton value="directed-edge" aria-label="directed-edge">
                        <ArrowTopRightIcon />
                    </StyledToggleButton>
                    <Wire value="text" >
                        {(props:any) => (
                            <StyledTooltip placement="right" arrow 
                                title={
                                    <div style={{display:'flex', alignItems:"center", gap:'4px'}}>
                                        <span>Text</span>
                                        <div style={tooltipStyles}>
                                            T
                                        </div>
                                    </div>
                                }
                            >
                                <StyledToggleButton aria-label="text" {...props}>
                                    <TextIcon />
                                </StyledToggleButton>
                            </StyledTooltip>
                        )}
                    </Wire>
                    <Wire value="contraction" >
                        {(props:any) => (
                            <StyledTooltip placement="right" arrow 
                                title={
                                    <div style={{display:'flex', alignItems:"center", gap:'4px'}}>
                                        <span>Contract nodes</span>
                                        <div style={tooltipStyles}>
                                            Ctrl+G
                                        </div>
                                    </div>
                                }
                            >
                                <StyledToggleButton aria-label="contraction" {...props}>
                                    <ContractionIcon />
                                </StyledToggleButton>
                            </StyledTooltip>
                        )}
                    </Wire>
                    <Wire value="expansion" >
                        {(props:any) => (
                            <StyledTooltip placement="right" arrow 
                                title={
                                    <div style={{display:'flex', alignItems:"center", gap:'4px'}}>
                                        <span>Expand nodes</span>
                                        <div style={tooltipStyles}>
                                            Ctrl+Shift+G
                                        </div>
                                    </div>
                                }
                            >
                                <StyledToggleButton aria-label="expansion" {...props}>
                                    <ExpansionIcon />
                                </StyledToggleButton>
                            </StyledTooltip>
                        )}
                    </Wire>
                    {/* <ToggleButton value="pan" aria-label="pan" sx={{background:THEME_COLORS.get("white"), color: THEME_COLORS.get("darkGray")}} classes={{ selected: classes.selected }}>
                        <HandIcon />
                    </ToggleButton> */}
                    {/* <ToggleButton value="node" aria-label="node" sx={{background:'red', color: 'green'}} classes={{ selected: classes.selected }}>
                        <IconButton aria-label="Node">
                            <Circle />
                        </IconButton>
                    </ToggleButton> */}
                    {/* <ToggleButton value="directed-edge" aria-label="directed-edge" classes={{ selected: classes.selected }}>
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
                    </ToggleButton> */}
                </StyledToggleButtonGroup>
                <StyledActionToggleButtonGroup
                    orientation="vertical"
                    exclusive
                >
                    <Wire value="undo" disabled={props.undoDisabled} onClick={() => props.onUndo()}>
                        {(props:any) => (
                            <StyledTooltip placement="right" arrow 
                                title={
                                    <div style={{display:'flex', alignItems:"center", gap:'4px'}}>
                                        <span>Undo</span>
                                        <div style={tooltipStyles}>
                                            Ctrl+Z
                                        </div>
                                    </div>
                                }
                            >
                                <StyledToggleButton 
                                    aria-label="Undo" 
                                    {...props}
                                >
                                    <UndoIcon />
                                </StyledToggleButton>
                            </StyledTooltip>
                        )}
                    </Wire>
                    <Wire value="redo" disabled={props.redoDisabled} onClick={() => props.onRedo()}>
                        {(props:any) => (
                            <StyledTooltip placement="right" arrow 
                                title={
                                    <div style={{display:'flex', alignItems:"center", gap:'4px'}}>
                                        <span>Redo</span>
                                        <div style={tooltipStyles}>
                                            Ctrl+Y
                                        </div>
                                    </div>
                                }
                            >
                                <StyledToggleButton 
                                    aria-label="Redo" 
                                    {...props}
                                >
                                    <RedoIcon />
                                </StyledToggleButton>
                            </StyledTooltip>
                        )}
                    </Wire>
                </StyledActionToggleButtonGroup>
            </Stack>
        </div>
    )
}