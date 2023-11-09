import { Dispatch, SetStateAction } from 'react';
import { DialogTitle, DialogActions, DialogWindow, DialogButton } from ".";
import { THEME_COLORS } from 'constants/colors';

interface DialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  saveGraphToDatabase: Function;
  setIsMessageWindowOpen: Function;
}

const MakeGraphPrivateDialog = ({ open, setOpen, saveGraphToDatabase, setIsMessageWindowOpen }: DialogProps) => {
      
  return (
    <DialogWindow
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="make-graph-private-dialog"
      width={'420px'}
    >
      <DialogTitle 
        id="make-graph-private-dialog" 
        onClose={() => setOpen(false)}
      >
        Are you sure you want to make your graph private?
      </DialogTitle>

      <div style={{fontSize:'0.875rem', color:'#6b7280', marginTop: "-8px"}}>
        Making your graph private will restrict access to it. However, please note that users who have already copied it will still have access to their copies.
      </div>
            
      <DialogActions>
        <DialogButton
          variant="outlined"
          sx={{color: THEME_COLORS.get('gray700'), background: THEME_COLORS.get('white'), border: '1px solid #e5e7eb'}}
          onClick={() => {
            setOpen(false); 
          }}
        >
          Cancel
        </DialogButton>
        <DialogButton
          variant="contained"
          sx={{background: THEME_COLORS.get('blue')}}
          onClick={() => {
            saveGraphToDatabase();
            setOpen(false);
            setIsMessageWindowOpen(true);
          }}
        >
          Make private
        </DialogButton>
      </DialogActions>
    </DialogWindow>
  );
};

export default MakeGraphPrivateDialog;