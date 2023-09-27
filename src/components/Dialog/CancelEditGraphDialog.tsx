import { Dispatch, SetStateAction} from 'react';
import { DialogTitle, DialogActions, DialogWindow, DialogButton } from "./index";
import { THEME_COLORS } from 'constants/colors';

interface DialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setGraphName: Dispatch<SetStateAction<string>>;
  setGraphNote: Dispatch<SetStateAction<string>>;
  prevGraphName: string;
  prevGraphNote: string;
  prevGraphPrivate: boolean;
  setIsPrivate: Dispatch<SetStateAction<boolean>>;
  saveGraphToDatabase: () => void;
}

const CancelEditGraphDialog = (props: DialogProps) => {
  const { open, setOpen, setGraphName, setGraphNote, prevGraphName, prevGraphNote, prevGraphPrivate, setIsPrivate, saveGraphToDatabase } = props;
    
  return (
    <DialogWindow
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="cancel-edit-graph-dialog"
      width={'420px'}
    >
      <DialogTitle 
        id="cancel-edit-graph-dialog" 
        onClose={() => {
          setIsPrivate(() => prevGraphPrivate); 
          setGraphName(prevGraphName);
          setGraphNote(prevGraphNote);
          setOpen(false);
        }}
      >
        Do you want to close without saving? 
      </DialogTitle>
    
      <div style={{fontSize:'0.875rem', color:'#6b7280'}}>
        You have unsaved changes. Are you sure you want to lose them?
      </div>
              
      <DialogActions>
        <DialogButton
          variant="outlined"
          sx={{color: THEME_COLORS.get('gray700'), background: THEME_COLORS.get('white'), border: '1px solid #e5e7eb'}}
          onClick={() => {
            saveGraphToDatabase();
            setOpen(false);
          }}
        >
          Save and close
        </DialogButton>
        <DialogButton
          variant="contained"
          sx={{background: THEME_COLORS.get('blue')}}
          onClick={() => {
            setIsPrivate(() => prevGraphPrivate); 
            setGraphName(prevGraphName);
            setGraphNote(prevGraphNote);
            setOpen(false); 
          }}
        >
          Close without saving
        </DialogButton>
      </DialogActions>
    </DialogWindow>
  );
};

export default CancelEditGraphDialog;