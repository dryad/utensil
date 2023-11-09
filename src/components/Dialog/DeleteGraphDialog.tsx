import { Dispatch, SetStateAction} from 'react';
import { DialogTitle, DialogActions, DialogWindow, DialogButton } from "./index";
import { THEME_COLORS } from 'constants/colors';

interface DialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onDelete: () => void;
  closeBar: Function | null;
  setIsMessageWindowOpen: Function;
}

const DeleteGraphDialog = (props: DialogProps) => {
  const { open, setOpen, onDelete, closeBar, setIsMessageWindowOpen } = props;
    
  return (
    <DialogWindow
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="delete-graph-dialog"
      width={'420px'}
    >
      <DialogTitle 
        id="delete-graph-dialog" 
        onClose={() => {
          setOpen(false);
        }}
      >
        Do you want to delete this graph? 
      </DialogTitle>
    
      <div style={{fontSize:'0.875rem', color:'#6b7280', marginTop: "-8px"}}>
        This action can't be undone.
      </div>
              
      <DialogActions>
        <DialogButton
          variant="outlined"
          sx={{
            color: THEME_COLORS.get('gray700'), 
            background: THEME_COLORS.get('white'), 
            border: '1px solid #e5e7eb',
            ':hover': {border: `1px solid ${THEME_COLORS.get('red')}`, background:'white'}
          }}
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </DialogButton>
        <DialogButton
          variant="contained"
          sx={{background: THEME_COLORS.get('red'), ':hover': {background: THEME_COLORS.get('red')}}}
          onClick={() => {
            setOpen(false); 
            onDelete();
            closeBar && closeBar();
            setIsMessageWindowOpen(true);
          }}
        >
          Delete
        </DialogButton>
      </DialogActions>
    </DialogWindow>
  );
};

export default DeleteGraphDialog;