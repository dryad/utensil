import React, { useEffect, useRef } from "react";
import { Tooltip } from "@mui/material";
import { DialogActions, DialogButton } from ".";
import { Graph } from "models";
import SmallNetwork from "components/SmallNetwork";
import VisCustomNetwork from "libs/vis-custom-network";
import { THEME_COLORS } from "constants/colors";

type GraphItemProps = {
  graph: Graph;
  handleImportButton: Function;
};

const GraphItemOnEditNodeDialog: React.FC<GraphItemProps> = ({
  graph,
  handleImportButton
}) => {
  const networkRef = useRef<VisCustomNetwork | null>(null);
  
  useEffect(() => {
    const data = JSON.parse(graph.data);
    networkRef.current?.setData(data);
  },[])
  
  return (
    <>
        <div style={{ border: '1px solid #f5f5f5', borderRadius:'4px',height: '83px', width: '104px'}}>
            <SmallNetwork networkRef={networkRef} />
        </div>  
        <div style={{'padding': '20px', flex: '1'}}>
            <div 
                style={{
                    'fontSize': '0.75rem', 
                    color: THEME_COLORS.get('black'),
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient:'vertical',
                    overflow: 'hidden',
                    'whiteSpace': 'pre-wrap',
                    'wordBreak': 'break-word',
                }}
            >
                {graph.name}
            </div>      
            <Tooltip 
                title={ 
                    <React.Fragment>
                        {graph.note}
                    </React.Fragment>
                }
            >
                <div 
                    style={{
                        'fontSize': '0.75rem', 
                        color: THEME_COLORS.get('darkGray'),
                        display: '-webkit-box',
                        WebkitLineClamp: '1',
                        WebkitBoxOrient:'vertical',
                        overflow: 'hidden',
                        'whiteSpace': 'pre-wrap',
                        'wordBreak': 'break-word',
                    }}
                >
                    {graph.note}
                </div>
            </Tooltip>      
        </div>
        <DialogActions>
            <DialogButton
                variant="outlined"
                sx={{color: THEME_COLORS.get('gray700'), background: THEME_COLORS.get('white'), border: '1px solid #e5e7eb'}}
                onClick={() => handleImportButton(graph.id)}
            >
                Import
            </DialogButton>
        </DialogActions>  
    </>
    );
};

export default GraphItemOnEditNodeDialog;
