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
  return (
    <Box sx={{ p: 2, borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px', backgroundColor: '#BBB',}}>
    {tree.nodes.map((node, nodeIndex) => {
    return <Chip
        key={nodeIndex}
        label={node.label}
        onClick={() => {
        onClick(node);
        }}
        onMouseEnter={() => {
        onHover(node);
        }}
        onMouseLeave={() => {
        onLeave(node);
        }}

    />
    })}
    </Box>
  );
};

export default TreeItem;