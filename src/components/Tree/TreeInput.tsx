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
  Popper,
  TableFooter,
} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Node, TreeNode, Graph } from "models";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
type IGraphListProps = {
    graphs: Graph[];
    setAutoCompleteOpen: Function;
    addNodeFromChips: Function;
    importGraphFromChips: Function;
    setSearchQuery: Function;
};
const filter = createFilterOptions<Graph>();

const StyledChip = styled(Chip)`
  &:hover {
    background-color: rgba(0, 0, 255, 0.4);
  }
`;

const StyledPopper = function (props) {
  return <Popper {...props}
    modifiers={{
      flip: {
        // enabled: false,
      },
      scroll: {
        enabled: true,
      }
    }}
    popperOptions={{
      placement: 'top',
    }}
    style={{ maxWidth: "fit-content" }} />;
};

const customListbox = (props) => {
  const { children, ...other } = props;
  return (
    <Table style={{ overflowY: 'scroll' }}
      {...other}
    >
      <TableBody >
        {children}
      </TableBody>
      <TableFooter>
             <TableRow>
                  <TableCell>
                   image
                 </TableCell>
                 <TableCell>
                   NAME
                 </TableCell>
                 <TableCell>
                   # uses
                 </TableCell>
                 <TableCell>
                   depth
                 </TableCell>
                 <TableCell>
                   # authors
                 </TableCell>
                 <TableCell>
                   description
                 </TableCell>
               </TableRow>
      </TableFooter>
    </Table>
  );
}

const TreeInput: React.FC<IGraphListProps> = (props) => {
  let borderTopLeftRadius = 16;
  let borderTopRightRadius = 16;
  let borderBottomLeftRadius = 16;
  let borderBottomRightRadius = 16;

  let marginRight = "0px";
  let marginLeft = "0px";
  const graphs = props.graphs;

  const handleChange = async (value) => {
    props.setSearchQuery(value);
  };

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
        // disablePortal={true} // always on top
        PopperComponent={StyledPopper}
        ListboxComponent={customListbox}
        renderOption={(props, option) => (
          <TableRow key={option.id}>
                   <TableCell>
                   <img
                      loading="lazy"
                      width="40"
                      height="40"
                      alt=""
                    />
                   </TableCell>
                   <TableCell>
                     {option.name}
                   </TableCell>
                   <TableCell>
                     <></>
                   </TableCell>
                   <TableCell>
                    <></>
                   </TableCell>
                   <TableCell>
                    <></> 
                   </TableCell>
                   <TableCell>
                     {option.note}
                   </TableCell>
                 </TableRow>
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
            onChange={event => {
              if (event.target.value !== "" || event.target.value !== null) {
                handleChange(event.target.value);
              }
            }}
          />
        )}
      />
    </Box>
  )
};

export default TreeInput;