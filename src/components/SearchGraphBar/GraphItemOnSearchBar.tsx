import React, { useEffect, useState } from 'react'
import { FileIcon, ReplaceIcon, ImportIcon } from 'assets/icons/svg';
import {Graph} from 'models';
import { styled } from '@mui/material/styles';
import { Tooltip, TooltipProps, tooltipClasses } from "@mui/material";
import { THEME_COLORS } from "constants/colors";

type Props = {
    graph: Graph;
    onConfirmReplace: () => void;
    onConfirmImport: () => void;
    onGraphSelected: (id: number) => void;
}

const ReplaceTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: THEME_COLORS.get("darkGray"),
      height: '24px',
      padding: '4px 8px',
      borderRadius: '8px',
      color: 'white',
      position: 'relative',
      right: '8px',
      bottom:'8px'
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: THEME_COLORS.get("darkGray"),    
        marginLeft: '10px'   
    },       
})

const ImportTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: THEME_COLORS.get("darkGray"),
      height: '24px',
      padding: '4px 8px',
      borderRadius: '8px',
      color: 'white',
      position: 'relative',
      bottom:'8px'
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: THEME_COLORS.get("darkGray"),    
    },       
})


export default function GraphItemOnSearchBar({graph, onConfirmImport, onConfirmReplace, onGraphSelected}: Props) {

    const shortenAddress = (address: string) => {
        const first = address.slice(0, 9);
        const last = address.slice(-3);
        return `${first}...${last}`;
    }

    const [isReplaced, setIsReplaced] = useState(false);
    const [isImported, setIsImported] = useState(false);

    useEffect(() => {
        if (isReplaced) {
            onConfirmReplace();
            setIsReplaced(false);
        }
    }, [isReplaced])

    useEffect(() => {
        if (isImported) {
            onConfirmImport();
            setIsImported(false);
        }
    }, [isImported])

  return (
    <div>        
        <div style={{fontSize:'0.875rem', display:'flex', alignItems:'center', gap:'4px'}}>
            <FileIcon />
            {graph.name}
        </div>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div>
                {graph.creator ?
                    <div style={{fontSize:'0.75rem', color: '#bcbcbc'}}>
                        by {shortenAddress(graph.creator)}
                    </div> :
                    null
                }
            </div>            
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:'4px'}}>
                <ReplaceTooltip placement="bottom" arrow 
                    title={<>Replace current graph</> }
                >
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center', width:'23px', height:'23px', cursor:'pointer'}}
                        onClick={() => {onGraphSelected(graph.id!); setIsReplaced(true); console.log('www')}}
                    >
                        <ReplaceIcon />
                    </div>
                </ReplaceTooltip>
                <ImportTooltip placement="bottom" arrow 
                    title={<>Import</> }
                >
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center', width:'23px', height:'23px', cursor:'pointer'}}
                        onClick={() => {onGraphSelected(graph.id!); setIsImported(true); console.log('www777')}}
                    >
                        <ImportIcon />
                    </div>
                </ImportTooltip>                
            </div>
        </div>    
    </div>
  )
}
