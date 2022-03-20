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
import { Tree } from "models";
import TreeLine from "./TreeLine";
type IGraphListProps = {
    tree: Tree;
};

const TreeItem: React.FC<IGraphListProps> = (props) => {
  const tree = props.tree;

  const onClick = (node) => {
    // console.log('Clicked', node);
  }
  const onHover = (node) => {
    // console.log('Hover', node);
  }
  const onLeave = (node) => {
    // console.log('Left', node);
  }

  //split tree into arrays of three nodes each
  const treeLines = [];
  let treeLine = [];
  for (let i = 0; i < tree.nodes.length; i++) {
    treeLine.push(tree.nodes[i]);
    if (treeLine.length === 3) {
      treeLines.push(treeLine);
      treeLine = [];
    }
  }
  if (treeLine.length > 0) {
    treeLines.push(treeLine);
  }


  return (
    <>
    {treeLines !== undefined && treeLines.map((line, lineIndex) => {
      return (
        <TreeLine key={lineIndex} line={line} />
      )
    })}
    </>
  );
};

export default TreeItem;