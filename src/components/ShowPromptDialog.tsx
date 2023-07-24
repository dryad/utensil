import { ReactNode, Dispatch, SetStateAction } from 'react';
import { Button, Dialog } from "@mui/material";
import { DialogTitle, DialogContent, DialogActions } from "./Dialog";

interface DialogProps {
  children: ReactNode;
  showPrompt: boolean;
  setShowPrompt: Dispatch<SetStateAction<boolean>>;
}

const ShowPromptDialog = (props: DialogProps) => {
  const { showPrompt, setShowPrompt } = props;
  return (
    <Dialog
      open={showPrompt}
      onClose={() => setShowPrompt(false)}
      aria-labelledby="show-prompt-dialog"
    >
      {/* <DialogTitle id="show-prompt-dialog" sx={{color: '#999', display: 'flex', justifyContent: 'center'}}>PROMPT </DialogTitle> */}
      <DialogContent>Connect your wallet first!</DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="info"
          onClick={() => {
            setShowPrompt(false);
          }}
        >
          OK
        </Button>        
      </DialogActions>
    </Dialog>
  );
};
export default ShowPromptDialog;