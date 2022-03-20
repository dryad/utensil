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
import { Node, TreeNode } from "models";

type IGraphListProps = {
    line: TreeNode[];
    lineIndex: number;
    lineLength: number;
};

const TreeLine: React.FC<IGraphListProps> = (props) => {
  const line = props.line;

  const onClick = (node) => {
    console.log('Clicked', node);
  }
  const onHover = (node) => {
    console.log('Hover', node);
  }
  const onLeave = (node) => {
    console.log('Left', node);
  }

  let borderTopLeftRadius = 0;
  let borderTopRightRadius = 0;
  let borderBottomLeftRadius = 0;
  let borderBottomRightRadius = 0;

  let marginRight = "0px";
  let marginLeft = "0px";
//   let firstLine = false;
  if (props.lineIndex === 0) {
    // firstLine = true;
    borderTopLeftRadius = 16;
    borderBottomLeftRadius = 16;
  }
  else {
      marginLeft = "10px";
  }
  
//   let lastLine = false;
  if (props.lineIndex === props.lineLength -1)  {
    // lastLine = true;
    borderTopRightRadius = 16;
    borderBottomRightRadius = 16;
    marginRight = "0px";
  }
  else {
      marginRight = "10px";
  }
  return (
    <Box sx={{ 
            p: 1, 
            borderTopLeftRadius: borderTopLeftRadius, 
            borderBottomLeftRadius: borderBottomLeftRadius, 
            borderTopRightRadius: borderTopRightRadius, 
            borderBottomRightRadius: borderBottomRightRadius, 
            marginLeft: marginLeft,
            marginRight: marginRight,
            backgroundColor: 'rgba(0, 0, 0, 0.1)' 
        }}>
    {line.map((node, nodeIndex) => {
        return <Chip
        sx={{backgroundColor: 'rgba(0, 0, 0, 0)'}}
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
  )
};

export default TreeLine;