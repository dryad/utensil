import React, { useEffect, useState } from "react";
import { Stack, Tooltip, TooltipProps, tooltipClasses } from "@mui/material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import VisCustomNetwork from "libs/vis-custom-network";
import { THEME_COLORS } from "constants/colors";
import { HandIcon, CursorIcon, CircleIcon, ArrowTopRightIcon, TextIcon, ContractionIcon, ExpansionIcon, UndoIcon, RedoIcon, LineIcon } from '../assets/icons/svg';
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
}))

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
})

const SecondaryStyledTooltip = styled(({ className, ...props }: TooltipProps) => (
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
})

const SecondaryTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      background: 'transparent',  
    },
})

const SecondaryButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    position: 'relative',
    top: '23px',
    right: '15px', 
}))

const SecondaryButton = styled(ToggleButton)(({ theme }) => ({
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
        background: THEME_COLORS.get("white"),
        color: THEME_COLORS.get("blue")
    },
    ':hover&.Mui-selected': {
        border: 'none',
        borderRadius: '4px',
        backgroundColor: THEME_COLORS.get("white"),
        color: THEME_COLORS.get("blue")
    },
    '&.Mui-selected': {
        border: 'none',
        borderRadius: '4px',
        backgroundColor: THEME_COLORS.get("white"),
        color: THEME_COLORS.get("blue"),
    },  
}))

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


export default function NetworkButtons(props: Props) {    

    const [lineMode, setLineMode] = useState<string>("directed-edge");

    useEffect(() => {
        if (props.buttonMode === 'edge') {
            setLineMode("edge");
        }
        if (props.buttonMode === 'directed-edge') {
            setLineMode("directed-edge");
        }
    },[props.buttonMode]);

    const [isLineArrowModeHovered, setIsLineArrowModeHovered] = useState(false);
        
    const handleChange = (event: React.MouseEvent<HTMLElement>, nextMode: string) => {
        if (nextMode !== null) { //disallow unselecting an item. 
            props.onButton(nextMode); // Tell Utensil.tsx to change the button mode
        }
    };

    const handleLineModeChange = (event: React.MouseEvent<HTMLElement>, nextMode: string) => {
        if (nextMode !== null) {  
            setLineMode(nextMode); 
            props.onButton(nextMode);
            setIsLineArrowModeHovered(false);
        }
    };

    useKeyDownHandler(props.onButton, props.onUndo, props.onRedo);

    const Wire = ({ children, ...props }: any) => children(props);
    
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
      setOpen(false);
    };
  
    const handleOpen = () => {
      setOpen(true);
    };

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
                    <Wire value="node" >
                        {(props:any) => (
                            <StyledTooltip placement="right" arrow 
                                title={
                                    <div style={{display:'flex', alignItems:"center", gap:'4px'}}>
                                        <span>Circle</span>
                                        <div style={tooltipStyles}>
                                            O
                                        </div>
                                    </div>
                                }
                            >
                                <StyledToggleButton aria-label="node" {...props}>
                                    <CircleIcon />
                                </StyledToggleButton>
                            </StyledTooltip>
                        )}
                    </Wire>
                                        
                    {/* ------ secondary tool bar ---- */}
                    <Wire value={lineMode} >
                        {(props:any) => (
                            <SecondaryTooltip placement="right"  
                                open={open} onClose={handleClose} onOpen={handleOpen}
                                title={
                                    <SecondaryButtonGroup
                                        orientation="vertical"
                                        value={lineMode} 
                                        exclusive
                                        onChange={handleLineModeChange}
                                        onMouseEnter={(e) => { setIsLineArrowModeHovered(true)}}
                                        onMouseLeave={(e) => { setIsLineArrowModeHovered(false); handleClose()}}
                                    >
                                        <Wire value="directed-edge" >
                                            {(props:any) => (
                                                <SecondaryStyledTooltip placement="right" arrow 
                                                    title={
                                                        <div style={{display:'flex', alignItems:"center", gap:'4px'}}>
                                                            <span>Arrow</span>
                                                            <div style={tooltipStyles}>
                                                                Shift+L
                                                            </div>
                                                        </div>
                                                    }
                                                >
                                                    <SecondaryButton aria-label="directed-edge" {...props}>
                                                        <ArrowTopRightIcon />
                                                    </SecondaryButton>
                                                </SecondaryStyledTooltip>
                                            )}
                                        </Wire>
                                                                    
                                        <Wire value="edge" >
                                            {(props:any) => (
                                                <SecondaryStyledTooltip placement="right" arrow 
                                                    title={
                                                        <div style={{display:'flex', alignItems:"center", gap:'4px'}}>
                                                            <span>Line</span>
                                                            <div style={tooltipStyles}>
                                                                L
                                                            </div>
                                                        </div>
                                                    }
                                                >
                                                    <SecondaryButton aria-label="edge" {...props}>
                                                        <LineIcon />
                                                    </SecondaryButton>
                                                </SecondaryStyledTooltip>
                                            )}
                                        </Wire>
                                    </SecondaryButtonGroup>
                                }
                            >
                                <StyledToggleButton  aria-label="directed-edge"  {...props}  
                                    style={{
                                        background: isLineArrowModeHovered ? THEME_COLORS.get("blue") : '',
                                        color: isLineArrowModeHovered ? 'white' : ''
                                    }}                                                                  
                                >
                                    { lineMode === 'directed-edge' &&
                                        <ArrowTopRightIcon />
                                    }
                                    { lineMode === 'edge' &&  
                                        <LineIcon />
                                    }                                    
                                </StyledToggleButton>
                            </SecondaryTooltip>
                        )}
                    </Wire>
                     {/* ------ secondary tool bar ---- */}

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
                                <span>
                                    <StyledToggleButton 
                                        aria-label="Undo" 
                                        {...props}
                                    >
                                        <UndoIcon />
                                    </StyledToggleButton>
                                </span>                                
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
                                <span>
                                    <StyledToggleButton 
                                        aria-label="Redo" 
                                        {...props}
                                    >
                                        <RedoIcon />
                                    </StyledToggleButton>
                                </span>                                
                            </StyledTooltip>
                        )}
                    </Wire>
                </StyledActionToggleButtonGroup>
            </Stack>
        </div>
    )
}