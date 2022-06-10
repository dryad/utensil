import React from 'react';
import { Button, Dialog, TextField } from "@mui/material";
import { DialogTitle, DialogContent, DialogActions } from "./Dialog";

const ConfirmClearDialog = (props) => {
  const { title, children, open, setOpen, onConfirmClear } = props;
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-clear-dialog"
    >
      <DialogTitle id="confirm-clear-dialog">Clear Graph?</DialogTitle>
      <DialogContent>You will lose all unsaved changes! Clear anyway?</DialogContent>
      <DialogActions>
        <Button
        variant="contained"
        onClick={() => {
          setOpen(false);
          onConfirmClear();
        }}
      >
        Clear graph
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
export default ConfirmClearDialog;