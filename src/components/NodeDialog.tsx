import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Button, Dialog, TextField } from "@mui/material";

import { DialogTitle, DialogContent, DialogActions } from "./Dialog";

type IDialogProps = {
  open: boolean;
  title?: string;
  nodeLabel?: string;
  onClose: Function;
  onOk: Function;
  setNodeLabel: Function;
};

const NodeDialog: React.FC<IDialogProps> = ({
  open,
  title,
  nodeLabel,
  onClose,
  onOk,
  setNodeLabel,
}) => {
  const okButton = useRef(null);
  useEffect(() => {
    setNodeLabel(nodeLabel);
  }, [nodeLabel]);

  return (
    <Dialog
      disableEnforceFocus
      fullWidth
      maxWidth="sm"
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle id="customized-dialog-title" onClose={onClose}>
        {title}
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          autoFocus
          fullWidth
          id="label"
          label="Label"
          value={nodeLabel}
          variant="outlined"
          onKeyDown={e => {
            if (e.key === 'Enter') { okButton.current.click(); }
          }} 
          onChange={(e) => {
            setNodeLabel(e.target.value);
          }}
          onFocus={event => {
            event.target.select();
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          ref={okButton}
          variant="outlined"
          color="primary"
          onClick={onOk(nodeLabel)}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NodeDialog;
