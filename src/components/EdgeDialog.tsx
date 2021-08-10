import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { DialogTitle, DialogContent, DialogActions } from "./Dialog";

type IDialogProps = {
  open: boolean;
  title?: string;
  directed?: number;
  onClose: Function;
  onOk: Function;
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

const EdgeDialog: React.FC<IDialogProps> = ({
  open,
  title,
  directed,
  onClose,
  onOk,
}) => {
  const [isDirected, setIsDirected] = useState(1);

  const classes = useStyles();

  useEffect(() => {
    setIsDirected(directed);
  }, [directed]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle id="customized-dialog-title" onClose={onClose}>
        {title}
      </DialogTitle>
      <DialogContent dividers>
        <form className={classes.root} noValidate autoComplete="off">
          <FormControl variant="outlined">
            <InputLabel id="demo-simple-select-outlined-label">
              Directed
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={isDirected}
              onChange={(e) => {
                setIsDirected(e.target.value);
              }}
              label="Directed"
            >
              <MenuItem value={1}>Yes</MenuItem>
              <MenuItem value={0}>No</MenuItem>
            </Select>
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          variant="outlined"
          color="primary"
          onClick={onOk(isDirected)}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EdgeDialog;
