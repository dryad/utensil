import React from "react";
import {
  Paper,
  TextField,
  Chip,
} from "@mui/material";
import { Tree } from "models";

type IGraphListProps = {
    //   graphs: Graph[];
//   onGraphSelected: React.MouseEventHandler<HTMLDivElement>;
//   onGraphDelete: React.MouseEventHandler<HTMLDivElement>;
//   searchQuery: string;
    Trees: Tree[];
    treeText: string; // very temporary
};

const TreeText: React.FC<IGraphListProps> = (props) => {
  return (
    // <Paper style={{height: '340px', overflow:'scroll'}}>
    // </Paper>
    <TextField
        id="outlined-basic"
        label=""
        variant="outlined"
        size="medium"
        value={props.treeText}
        fullWidth
        multiline
        inputProps={{readOnly: true, min: 0, style: { textAlign: 'center' }}} //center the text
    />
  );
};

export default TreeText;
