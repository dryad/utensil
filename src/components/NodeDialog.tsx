import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Button, Dialog, TextField } from "@material-ui/core";

import { DialogTitle, DialogContent, DialogActions } from "./Dialog";

type IDialogProps = {
  open: boolean;
  title?: string;
  label?: string;
  onClose: Function;
  onOk: Function;
};

const NodeDialog: React.FC<IDialogProps> = ({
  open,
  title,
  label,
  onClose,
  onOk,
}) => {
  const [nodeLabel, setNodeLabel] = useState(label);
  const okButton = useRef(null);
  useEffect(() => {
    setNodeLabel(label);
  }, [label]);

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
