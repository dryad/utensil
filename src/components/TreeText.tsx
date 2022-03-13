import React from "react";
import {
  Paper,
  TextField,
  Chip,
  Stack,
  Typography
} from "@mui/material";
import { Tree } from "models";

type IGraphListProps = {
    Trees: Tree[];
};

const TreeText: React.FC<IGraphListProps> = (props) => {
  const trees = props.Trees;

  return (
    <>
      {trees.map((tree, index) => {
        return (
          <Stack key={index} direction="row" spacing={1} justifyContent="center">
          {tree.nodes.map((node, index) => {
            return <Chip
              key={index}
              label={node.label}
            />
          })}
          </Stack>
        )
      })}
    </>
  );
};

export default TreeText;