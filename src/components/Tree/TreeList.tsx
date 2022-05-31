import React, { useRef, useEffect } from "react";
import {
  Paper,
  TextField,
  Chip,
  Stack,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconButton from '@mui/material/IconButton';

import { Tree, Graph } from "models";
import TreeItem from "./TreeItem";
import TreeInput from "./TreeInput";
type IGraphListProps = {
    Trees: Tree[];
    hoveredNodes: string[];
    selectedNodes: string[];
    setHoveredChipToVis: Function;
    graphs: Graph[];
    addNodeFromChips: Function;
    importGraphFromChips: Function;
};



const TreeList: React.FC<IGraphListProps> = (props) => {
  const trees = props.Trees;
  const graphs = props.graphs;

  const [autoCompleteOpen, setAutoCompleteOpen] = React.useState(false);
  
  // useEffect(() => {
  //   if (trees.length == 0) {
  //     setAutoCompleteOpen(true);
  //   }
  // }, [trees]);

  return (
    <Box
      sx={{ p: 2, border: '1px solid grey', borderRadius: '16px' }}
    // onClick={(event) => { 
    //   if (event.target === event.currentTarget) {
    //     setAutoCompleteOpen(true);
    //   }
    // }}
    >
      <Stack
        direction="column"
        spacing={1}
      >
        {!autoCompleteOpen && (
          <Stack key={0} direction="row" spacing={1} justifyContent="center">
          <IconButton color="primary" aria-label="add" component="span">
            <AddCircleOutlineIcon
              onClick={() => {
                setAutoCompleteOpen(true);
              }}
            style={{
            //   position: "relative",
              top: "0px",
              right: "0px",
            //   color: "rgba(0, 0, 0, 0.4)",
            //   cursor: "pointer",
            }}
            />
          </IconButton>
          </Stack>
        )}
        {trees.map((tree, index) => {
          return (
            <Stack key={index} direction="row" spacing={1} justifyContent="center">
              <TreeItem tree={tree} graphs={props.graphs} hoveredNodes={props.hoveredNodes} selectedNodes={props.selectedNodes} setHoveredChipToVis={props.setHoveredChipToVis} />
            </Stack>
          )
        })}
        {autoCompleteOpen && (
          <Stack key={'input'} direction="row" spacing={1} justifyContent="center">
            <TreeInput graphs={graphs} setAutoCompleteOpen={setAutoCompleteOpen} addNodeFromChips={props.addNodeFromChips} importGraphFromChips={props.importGraphFromChips} />
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default TreeList;