import React, { useRef, useEffect } from "react";
import {
  Paper,
  TextField,
  Chip,
  Stack,
  Typography,
  Divider,
  Box
} from "@mui/material";
import { Node, TreeNode, Graph } from "models";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
type IGraphListProps = {
    graphs: Graph[];
};
const filter = createFilterOptions<Graph>();

const StyledChip = styled(Chip)`
  &:hover {
    background-color: rgba(0, 0, 255, 0.4);
  }
`;
const TreeInput: React.FC<IGraphListProps> = (props) => {
  // console.log('props.hoverNodes', props.hoveredNodes.current?.includes('a0e91e03-21bd-4413-b875-4c8cb801f335'));
  let borderTopLeftRadius = 16;
  let borderTopRightRadius = 16;
  let borderBottomLeftRadius = 16;
  let borderBottomRightRadius = 16;

  let marginRight = "0px";
  let marginLeft = "0px";
  const graphs = props.graphs;
  const [value, setValue] = React.useState<Graph | null>(null);
  useEffect (() => {
    if (value !== null) {
      console.log('new value', value);
    }
  }, [value]);
  return (
    <Box width={250} sx={{ 
            p: 1, 
            borderTopLeftRadius: borderTopLeftRadius, 
            borderBottomLeftRadius: borderBottomLeftRadius, 
            borderTopRightRadius: borderTopRightRadius, 
            borderBottomRightRadius: borderBottomRightRadius, 
            marginLeft: marginLeft,
            marginRight: marginRight,
            backgroundColor: 'rgba(0, 0, 0, 0.1)' 
        }}>
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
        freeSolo
        renderInput={(params) => (
          <TextField 
            variant="standard" 
            fullWidth 
            {...params} 
            label="" 
            InputProps={{...params.InputProps, disableUnderline: true, style: { fontSize: '0.8125rem' }}}
          />
        )}
      />
    </Box>
  )
};

export default TreeInput;