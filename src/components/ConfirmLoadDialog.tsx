import React from 'react';
import { Button, Dialog, TextField } from "@mui/material";
import { DialogTitle, DialogContent, DialogActions } from "./Dialog";

const ConfirmLoadDialog = (props) => {
  const { title, children, open, setOpen, onConfirmReplace, onConfirmImport, canImportGraph } = props;
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-load-dialog"
    >
      <DialogTitle id="confirm-load-dialog">Loading: <b>{title}</b></DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {canImportGraph() && (
          <>
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
            onClick={() => {
              setOpen(false);
              onConfirmImport();
            }}
          >
            Import this graph
          </Button>
          </>
        )}
        {!canImportGraph() && (
        <Button
        variant="contained"
        onClick={() => {
          setOpen(false);
          onConfirmReplace();
        }}
      >
        Load graph
      </Button>
        )}
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
export default ConfirmLoadDialog;