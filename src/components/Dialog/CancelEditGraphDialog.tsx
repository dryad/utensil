import { Dispatch, SetStateAction} from 'react';
import { DialogTitle, DialogActions, DialogWindow, DialogButton } from ".";
import { THEME_COLORS } from 'constants/colors';

interface DialogProps {
  openCancelEditGraphDialog: boolean;
  setOpenCancelEditGraphDialog: Dispatch<SetStateAction<boolean>>;
  setGraphName: Dispatch<SetStateAction<string>>;
  setGraphNote: Dispatch<SetStateAction<string>>;
  prevGraphName: string;
  prevGraphNote: string;
  prevGraphPrivate: boolean;
  setIsPrivate: Dispatch<SetStateAction<boolean>>;
  saveGraphToDatabase: () => void;
}

const CancelEditGraphDialog = (props: DialogProps) => {
  const { openCancelEditGraphDialog, setOpenCancelEditGraphDialog, setGraphName, setGraphNote, prevGraphName, prevGraphNote, prevGraphPrivate, setIsPrivate, saveGraphToDatabase } = props;
    
  return (
    <DialogWindow
      open={openCancelEditGraphDialog}
      onClose={() => setOpenCancelEditGraphDialog(false)}
      aria-labelledby="cancel-edit-graph-dialog"
      width={'420px'}
    >
      <DialogTitle 
        id="cancel-edit-graph-dialog" 
        onClose={() => {
          setIsPrivate(() => prevGraphPrivate); 
          setGraphName(prevGraphName);
          setGraphNote(prevGraphNote);
          setOpenCancelEditGraphDialog(false);
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
            setOpenCancelEditGraphDialog(false);
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
            setOpenCancelEditGraphDialog(false); 
          }}
        >
          Close without saving
        </DialogButton>
      </DialogActions>
    </DialogWindow>
  );
};

export default CancelEditGraphDialog;