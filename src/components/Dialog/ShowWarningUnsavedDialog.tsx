import { useGraphStore } from "store/GraphStore";
import { DialogTitle, DialogActions, DialogWindow, DialogButton } from ".";
import { THEME_COLORS } from 'constants/colors';
import { useShallow } from "zustand/react/shallow";
import functionalGraphData from "functions/functionalGraphIds.json"; 

interface DialogProps {
  open: boolean;
  setOpen: Function;
  setOpenSaveGraphDialog: Function;
  setOpenUtensilModal: Function;
  saveGraphToDatabase: Function;
}

const ShowWarningUnsavedDialog = ({ open, setOpen, setOpenSaveGraphDialog, setOpenUtensilModal, saveGraphToDatabase }: DialogProps) => {
    
  const [graphName, graphId] = useGraphStore(
    useShallow((state) => [
      state.graphName,   
      state.graphId
    ])
  );

  return (
    <DialogWindow
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="show-warning-unsaved-dialog"
      width={'420px'}
    >
      <DialogTitle 
        id="show-warning-unsaved-dialog" 
        onClose={() => setOpen(false)}
      >
        Do you want to close without saving?
      </DialogTitle>

      <div style={{fontSize:'0.875rem', color:'#6b7280', marginTop: "-8px"}}>
        You have unsaved changes. Are you sure you want to lose them?
      </div>
            
      <DialogActions>
        <DialogButton
          variant="outlined"
          sx={{color: THEME_COLORS.get('gray700'), background: THEME_COLORS.get('white'), border: '1px solid #e5e7eb'}}
          onClick={() => {
            graphName && graphId && !functionalGraphData.hasOwnProperty(graphId)
              ? saveGraphToDatabase() 
              : setOpenSaveGraphDialog(true);
          }}
        >
          Save
        </DialogButton>
        <DialogButton
          variant="contained"
          sx={{background: THEME_COLORS.get('blue')}}
          onClick={() => {
            setOpen(false);
            setOpenUtensilModal(false);
          }}
        >
          Close without saving
        </DialogButton>
      </DialogActions>
    </DialogWindow>
  );
};

export default ShowWarningUnsavedDialog;