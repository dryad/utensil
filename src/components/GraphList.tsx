import React from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { Graph } from "models";

type IGraphListProps = {
  graphs: Graph[];
  onGraphSelected: React.MouseEventHandler<HTMLDivElement>;
  onGraphDelete: React.MouseEventHandler<HTMLDivElement>;
};

const GraphList: React.FC<IGraphListProps> = (props) => {
  return (
    <Paper>
      <List>
        {props.graphs.length === 0 ? (
          <ListItem>No graphs yet.</ListItem>
        ) : (
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
                >
                  <Delete />
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
