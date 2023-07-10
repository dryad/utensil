import React from 'react';
import { Button, Dialog } from "@mui/material";
import { DialogTitle, DialogContent, DialogActions } from "./Dialog";

interface DialogProps {
  children: React.ReactNode;
  showWarning: boolean;
  setShowWarning: (value :boolean) => void;
  handleSaveGraph: (value :boolean) => void;
  setStartNewConcept: (value :boolean) => void;
}

const ShowWarningDialog = (props: DialogProps) => {
  const { showWarning, setShowWarning, handleSaveGraph, setStartNewConcept } = props;
  return (
    <Dialog
      open={showWarning}
      onClose={() => setShowWarning(false)}
      aria-labelledby="show-warning-dialog"
    >
      <DialogTitle id="show-warning-dialog" sx={{color: '#999', display: 'flex', justifyContent: 'center'}}>WARNING </DialogTitle>
      <DialogContent>Your work is about to be lost!</DialogContent>
      <DialogActions>

        <Button
          color="secondary"
          variant="contained"
          onClick={() => {
            setShowWarning(false);
            setStartNewConcept(false);
          }}
        >
          Exit and do not save
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={() => {
            setShowWarning(false);
            handleSaveGraph(true);
            setStartNewConcept(false);
          }}
        >
          Save
        </Button>

        
      </DialogActions>
    </Dialog>
  );
};
export default ShowWarningDialog;