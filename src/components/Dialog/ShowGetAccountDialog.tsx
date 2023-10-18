import { Dispatch, SetStateAction } from 'react';
import { DialogTitle, DialogActions, DialogWindow, DialogButton } from ".";
import { THEME_COLORS } from 'constants/colors';
import { useShallow } from 'zustand/react/shallow'
import { useGraphStore } from 'store/GraphStore';

interface DialogProps {
  showGetAccountMessage: boolean;
  setShowGetAccountMessage: Dispatch<SetStateAction<boolean>>;
}

const ShowGetAccountDialog = (props: DialogProps) => {
  const { showGetAccountMessage, setShowGetAccountMessage } = props;

  const [setIsPrivate] = useGraphStore(
    useShallow((state) => [
      state.setIsPrivate,      
    ])
  );
    
  return (
    <DialogWindow
      open={showGetAccountMessage}
      onClose={() => {setShowGetAccountMessage(false); setIsPrivate(false)}}
      aria-labelledby="show-warning-dialog"
      width={'420px'}
    >
      <DialogTitle 
        id="show-warning-dialog" 
        onClose={() => {setShowGetAccountMessage(false); setIsPrivate(false)}}
      >
        Warning
      </DialogTitle>
    
      <div>
        <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
          <div style={{fontSize:"0.9375rem", fontWeight:'500', color: "#191919"}}>
            Get your MetaMask account first before saving private concept!
          </div>
        </div>       
      </div>
      
      <DialogActions>
        <DialogButton
          variant="contained"
          sx={{background: THEME_COLORS.get('blue')}}
          onClick={() => {
            setShowGetAccountMessage(false);
            setIsPrivate(false);           
          }}
        >
          OK
        </DialogButton>
      </DialogActions>
    </DialogWindow>
  );
};

export default ShowGetAccountDialog;