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
    Trees: Tree[];
};

const TreeText: React.FC<IGraphListProps> = (props) => {
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
        divider={
          <Divider
            orientation="horizontal"
            flexItem />}
      >
        {trees.map((tree, index) => {
          return (
            <>
            
            <Stack key={index} direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
            <Typography>{index+1}.</Typography>  
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

              {/* {index + 1 !== trees.length && (
          )} */}
            </Stack>
            </>
          )

        })}
      </Stack>
    </Box>
  );
};

export default TreeText;