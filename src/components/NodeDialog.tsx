import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    setNodeLabel(label);
  }, [label]);

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
        <TextField
          autoFocus
          fullWidth
          id="label"
          label="Label"
          value={nodeLabel}
          variant="outlined"
          onChange={(e) => {
            setNodeLabel(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
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
