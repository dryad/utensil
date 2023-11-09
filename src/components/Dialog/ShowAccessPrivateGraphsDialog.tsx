import { Dispatch, SetStateAction } from 'react';
import { DialogActions, DialogWindow, StyledOKButton, InfoDialogTitle } from ".";
import { THEME_COLORS } from 'constants/colors';
import { useShallow } from 'zustand/react/shallow'
import { useMetaMaskAccountStore } from 'store/MetaMaskAccountStore';

interface DialogProps {
  showMessage: boolean;
  setShowMessage: Dispatch<SetStateAction<boolean>>;
}

const ShowAccessPrivateGraphsDialog = (props: DialogProps) => {
  const { showMessage, setShowMessage } = props;

  const [metaMaskAccount] = useMetaMaskAccountStore(
    useShallow((state) => [
      state.metaMaskAccount,
    ])
  );
    
  return (
    <DialogWindow
      open={showMessage}
      onClose={() => {setShowMessage(false)}}
      aria-labelledby="show-info-dialog"
      width={'420px'}
    >
      <InfoDialogTitle 
        id="show-info-dialog" 
      >
        {metaMaskAccount 
          ? 'Switch to your profile first'
          : 'Connect your wallet first'
        }        
      </InfoDialogTitle>

      <div style={{fontSize:"0.875rem", fontWeight:'400', color: THEME_COLORS.get('gray500')}}>
        {metaMaskAccount 
          ? "You can't access private graphs. Switch to your profile first."
          : "You can’t access private graphs, if you don’t have an account. Connect your wallet to create an account."
        }  
      </div>
      
      <DialogActions sx={{display:'flex', justifyContent:'center'}}>
        <StyledOKButton
          onClick={() => {
            setShowMessage(false);          
          }}
        >
          OK
        </StyledOKButton>
      </DialogActions>
    </DialogWindow>
  );
};

export default ShowAccessPrivateGraphsDialog;