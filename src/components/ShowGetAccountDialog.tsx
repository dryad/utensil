import { ReactNode, Dispatch, SetStateAction } from 'react';
import { Button, Dialog } from "@mui/material";
import { DialogTitle, DialogContent, DialogActions } from "./Dialog";

interface DialogProps {
  children: ReactNode;
  showGetAccountMessage: boolean;
  setShowGetAccountMessage: Dispatch<SetStateAction<boolean>>;
  setIsPrivate: Dispatch<SetStateAction<boolean>>;
}

const ShowGetAccountDialog = (props: DialogProps) => {
  const { showGetAccountMessage, setShowGetAccountMessage, setIsPrivate } = props;
  return (
    <Dialog
      open={showGetAccountMessage}
      onClose={() => {setShowGetAccountMessage(false); setIsPrivate(false)}}
      aria-labelledby="show-warning-dialog"
    >
      <DialogTitle id="show-warning-dialog" sx={{color: '#999', display: 'flex', justifyContent: 'center'}}>WARNING </DialogTitle>
      <DialogContent>Get your MetaMask account first before saving private concept!</DialogContent>
      <DialogActions>

        <Button
          color="secondary"
          variant="contained"
          onClick={() => {
            setShowGetAccountMessage(false);
            setIsPrivate(false);           
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ShowGetAccountDialog;