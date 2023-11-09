import { Dispatch, SetStateAction } from 'react';
import { DialogActions, DialogWindow, StyledOKButton, InfoDialogTitle } from ".";
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
      aria-labelledby="show-info-dialog"
      width={'420px'}
    >
      <InfoDialogTitle 
        id="show-info-dialog" 
      >
        Connect your wallet first
      </InfoDialogTitle>

      <div style={{fontSize:"0.875rem", fontWeight:'400', color: THEME_COLORS.get('gray500')}}>
        You need to connect your wallet to save private graphs
      </div>
      
      <DialogActions sx={{display:'flex', justifyContent:'center'}}>
        <StyledOKButton
          onClick={() => {
            setShowGetAccountMessage(false);
            setIsPrivate(false);           
          }}
        >
          OK
        </StyledOKButton>
      </DialogActions>
    </DialogWindow>
  );
};

export default ShowGetAccountDialog;