import React, { useRef, useEffect } from "react";
import {
  Paper,
  TextField,
  Chip,
  Stack,
  Typography,
  Divider,
  Box,
  Card,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Popper
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

const StyledPopper = function (props) {
  return <Popper {...props} style={{maxWidth: "fit-content"}} placement="bottom-start" />;
};

const TreeInput: React.FC<IGraphListProps> = (props) => {
  let borderTopLeftRadius = 16;
  let borderTopRightRadius = 16;
  let borderBottomLeftRadius = 16;
  let borderBottomRightRadius = 16;

  let marginRight = "0px";
  let marginLeft = "0px";
  const graphs = props.graphs;

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
        PopperComponent={StyledPopper}
        renderOption={(props, option) => (
          <div key={option.id}>
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            <img
              loading="lazy"
              width="40"
              height="40"
              alt=""
            />
                 <ListItemText
                   primary={option.name}
                   secondary={
                     <React.Fragment>
                       <Typography
                         component="span"
                         variant="body2"
                         // className={classes.inline}
                         color="textPrimary"
                       >
                         {option.note}
                      </Typography>
             </React.Fragment>
            }
            />
          </Box>
          </div>
        )}
        onChange={(event, newValue) => {
          console.log('onChange', newValue);
          if (newValue && newValue.data) {
            // type name of graph, its found in db. press enter or click name.
            console.log('Importing graph with name and id:', newValue.name, newValue.id);
            props.importGraphFromChips(newValue.id);
          } else if (typeof newValue === 'string' || (newValue !== null && newValue.name !== null && typeof newValue.name === 'string')) {
            // type name of new node press enter or click name
            let nodeName = newValue.inputValue ? newValue.inputValue : newValue;
            console.log('Creating node with name:', nodeName);
            props.addNodeFromChips(nodeName, 100, 100);
          }
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
              id: '0',
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
        freeSolo
        renderInput={(params) => (
          <TextField 
            variant="standard" 
            {...params} 
            label="" 
            autoFocus
            InputProps={{...params.InputProps, disableUnderline: true, style: { fontSize: '0.8125rem' }}}
          />
        )}
      />
    </Box>
  )
};

export default TreeInput;