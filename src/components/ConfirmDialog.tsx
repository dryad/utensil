import React from 'react';
import { Button, Dialog, TextField } from "@mui/material";
import { DialogTitle, DialogContent, DialogActions } from "./Dialog";

const ConfirmDialog = (props) => {
  const { title, children, open, setOpen, onConfirmReplace, onConfirmImport } = props;
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog">Loading: <b>{title}</b></DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            onConfirmReplace();
          }}
        >
          Replace current graph
        </Button>
        <Button
          variant="contained"

        >
          Import this graph
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmDialog;