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
    setAutoCompleteOpen: Function;
    addNodeFromChips: Function;
    importGraphFromChips: Function;
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
  const [value, setValue] = React.useState("");

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
        inputValue={value}
        onChange={(event, newValue) => {
          console.log('onChange', newValue);
          if (typeof newValue === 'string') {
            console.log('Creating node with name:', newValue);



            props.addNodeFromChips(newValue, 100, 100);
          
          } else if (newValue && newValue.name) {
            console.log('Importing graph with name and id:', newValue.name, newValue.id);
            props.importGraphFromChips(newValue.id);
          } else {

          }
          setValue("");
          props.setAutoCompleteOpen(false);
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          // console.log('filtered', filtered);
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
            onChange={(event) =>
              {
                  setValue(event.target.value)
              }}
          />
        )}
      />
    </Box>
  )
};

export default TreeInput;