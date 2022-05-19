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
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Tree, Graph } from "models";
import TreeItem from "./TreeItem";

type IGraphListProps = {
    Trees: Tree[];
    hoveredNodes: string[];
    selectedNodes: string[];
    setHoveredChipToVis: Function;
    graphs: Graph[];
};

const filter = createFilterOptions<Graph>();

const TreeList: React.FC<IGraphListProps> = (props) => {
  const trees = props.Trees;
  const graphs = props.graphs;
  const [value, setValue] = React.useState<Graph | null>(null);
  
  useEffect (() => {
    if (value !== null) {
      console.log('new value', value);
    }
  }, [value]);
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
        <Autocomplete
          value={value}
          // onChange={(event, newValue) => {
          //   if (typeof newValue === 'string') {
          //     setValue({
          //       name: newValue,
          //     });
          //   } else if (newValue && newValue.inputValue) {
          //     // Create a new value from the user input
          //     setValue({
          //       name: newValue.inputValue,
          //     });
          //   } else {
          //     setValue(newValue);
          //   }
          // }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            console.log('filtered', filtered);
            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some((option) => inputValue === option.name);
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                inputValue,
                name: `Add "${inputValue}"`,
              });
            }
            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="free-solo-with-text-demo"
          options={graphs}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === 'string') {
              return option;
            }
            // Add "xxx" option created dynamically
            if (option.inputValue) {
              return option.inputValue;
            }
            // Regular option
            return option.name;
          }}
          renderOption={(props, option) => <li {...props} key={option.id}>{option.name}</li>}
          sx={{ width: 300 }}
          freeSolo
          renderInput={(params) => (
            <TextField {...params} label="Type here..." />
          )}
        />
        
      </Stack>
    </Box>
  );
};

export default TreeList;