import React from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Graph } from "models";

type IGraphListProps = {
  graphs: Graph[];
  onGraphSelected: (id: number) => void;
  onGraphDelete: React.MouseEventHandler<HTMLDivElement>;
  searchQuery: string;
  address_is_whitelisted: () => boolean;
};

const GraphList: React.FC<IGraphListProps> = (props) => {
  return (
    <Paper style={{height: '340px', overflow:'scroll'}}>
      <List>
        {props.graphs.length === 0 && props.searchQuery == ""  && (
          <ListItem>No graphs yet.</ListItem>
        )}
        {props.graphs.length === 0 && props.searchQuery !== "" && (
          <ListItem>No results for {props.searchQuery}.</ListItem>
        )}
        {props.graphs.length > 0 && (
          props.graphs.map((g: Graph) => (
            <ListItem
              onClick={(e: any) => {
                props.onGraphSelected(g.id);
              }}
              button
              key={g.id}
            >
              <ListItemText>{g.name}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e: any) => {
                    props.onGraphDelete(g.id);
                  }}
                  size="large">
                  {props.address_is_whitelisted() && (
                    <Delete />
                  )}
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};

export default GraphList;
