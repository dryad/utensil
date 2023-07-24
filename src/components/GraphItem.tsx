import React, { useEffect, useRef } from "react";
import { Button, TableCell } from "@mui/material";
import { DialogActions } from "./Dialog";
import { Graph } from "models";
import SmallNetwork from "./SmallNetwork";
import VisCustomNetwork from "libs/vis-custom-network";

type GraphItemProps = {
  graph: Graph;
  handleImportButton: Function;
};

const GraphItem: React.FC<GraphItemProps> = ({
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
        <TableCell sx={{'padding': '0'}}>
            <SmallNetwork networkRef={networkRef} />
        </TableCell>  
        <TableCell sx={{'padding': '0'}}>
            {graph.name}
        </TableCell>
        <TableCell sx={{'padding': '0'}}>
            {graph.note}
        </TableCell>
        <TableCell align="right" sx={{'padding': '0'}}>
            <DialogActions>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleImportButton(graph.id)}
                >
                    Import
                </Button>
            </DialogActions>
        </TableCell>     
    </>
    );
};

export default GraphItem;
