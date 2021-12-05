import React from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Box
} from "@mui/material";
// import UndoIcon from '@mui/icons-material/Undo';
import { Undo, Redo, Circle, ArrowRightAlt, Minimize } from "@mui/icons-material";
import SvgIcon from '@mui/material/SvgIcon';


export const NetworkButtons = () => <aside>
  <Box m={1}>
    <Undo/>
    <Redo/>
  </Box>
  <Box m={1}>
    <Circle/>
  </Box>
  <Box m={1}>
    <ArrowRightAlt style={{'transform': 'rotate(-45deg)'}}/>
  </Box>
  <Box m={1}>
    <Minimize style={{'transform': 'translate(-7px, -5px) rotate(-45deg)'}}/>
  </Box>
  </aside>
