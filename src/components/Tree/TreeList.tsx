import React from "react";
import {
  Paper,
  TextField,
  Chip,
  Stack,
  Typography,
  Divider,
  Box
} from "@mui/material";
import { Tree, Graph } from "models";
import TreeItem from "./TreeItem";

type IGraphListProps = {
    Trees: Tree[];
    hoveredNodes: string[];
    selectedNodes: string[];
    setHoveredChipToVis: Function;
    graphs: Graph[];
};

const TreeList: React.FC<IGraphListProps> = (props) => {
  const trees = props.Trees;
  const onClick = (node) => {
    // console.log('Clicked', node);
  }
  const onHover = (node) => {
    // console.log('Hover', node);
  }
  const onLeave = (node) => {
    // console.log('Left', node);
  }
  return (
    <Box sx={{ p: 2, border: '1px solid grey', borderRadius: '16px' }}>
      <Stack
        direction="column"
        spacing={1}
      >
        {trees.map((tree, index) => {
          return (
            <Stack key={index} direction="row" spacing={1} justifyContent="center">
              <TreeItem tree={tree} graphs={props.graphs} hoveredNodes={props.hoveredNodes} selectedNodes={props.selectedNodes} setHoveredChipToVis={props.setHoveredChipToVis}/>
            </Stack>
          )

        })}
      </Stack>
    </Box>
  );
};

export default TreeList;