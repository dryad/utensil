import { ReactNode, Dispatch, SetStateAction } from 'react';
import { Button, Dialog } from "@mui/material";
import { DialogTitle, DialogContent, DialogActions } from "./Dialog";

interface DialogProps {
  children: ReactNode;
  showWarning: boolean;
  setShowWarning: Dispatch<SetStateAction<boolean>>;
  setOpenSaveGraphDialog: Dispatch<SetStateAction<boolean>>;
  setStartNewConcept?: Dispatch<SetStateAction<boolean>>;
}

const ShowWarningDialog = (props: DialogProps) => {
  const { showWarning, setShowWarning, setOpenSaveGraphDialog, setStartNewConcept } = props;
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
            setStartNewConcept?.(false);
          }}
        >
          Exit and do not save
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={() => {
            setShowWarning(false);
            setOpenSaveGraphDialog(true);
          }}
        >
          Save
        </Button>        
      </DialogActions>
    </Dialog>
  );
};
export default ShowWarningDialog;