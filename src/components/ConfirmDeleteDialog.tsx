import React from 'react';
import { Button, Dialog, TextField } from "@mui/material";
import { DialogTitle, DialogContent, DialogActions } from "./Dialog";

const ConfirmDeleteDialog = (props: any) => {
  const { title, children, open, setOpen, onConfirmDelete } = props;
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-delete-dialog"
    >
      <DialogTitle id="confirm-delete-dialog">Deleting: <b>{title}</b></DialogTitle>
      <DialogContent>Are you sure you want to delete this graph from the database?</DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            onConfirmDelete();
          }}
        >
          Delete
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
export default ConfirmDeleteDialog;