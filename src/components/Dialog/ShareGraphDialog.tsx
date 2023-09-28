import {useState, useEffect, Dispatch, SetStateAction} from 'react';
import { DialogTitle, DialogActions, DialogWindow, InputField, DialogButton } from ".";
import { THEME_COLORS } from 'constants/colors';
import axios from "libs/axios";

interface DialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  graphName: string;
  graphId: number | null;
}

const ShareGraphDialog = ({ open, setOpen, graphName, graphId }: DialogProps) => {
    
  const [error, setError] = useState(false);
  const [notValidError, setNotValidError] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
    
  useEffect(() => {
    if (walletAddress !== "")  {
      setError(false);
    } 
    if (isAddress(walletAddress)) {
      setNotValidError(false);
    }
  }, [walletAddress]);

  const isAddress = function (address: string) {
    // check if it has the basic requirements of an address

    if (/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        return true;
    } else {
        return false;
    }
  };

  const saveSharedGraphToDatabase = async(addressToShare: string) => {
    await axios.post("api/graphs/shared/", {
      address: addressToShare, 
      graphId: graphId,
    }).then(response => {
        if (response.data.id) {
          console.log('Saved info to the database with this id: ', response.data.id);
        }
      });    
  }

  
  return (
    <DialogWindow
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="share-graph-dialog"
      width={'420px'}
    >
      <DialogTitle 
        id="share-graph-dialog" 
        onClose={() => setOpen(false)}
      >
        Share {graphName} 
      </DialogTitle>
    
      <div>
        <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
          <div style={{fontSize:"0.9375rem", fontWeight:'500', color: "#191919"}}>
            Wallet address
          </div>
          <InputField
            id="outlined-basic"
            variant="outlined"
            value={walletAddress}
            placeholder='Enter address'
            error={error && notValidError}
            helperText={error ? "Address required" : notValidError ? "Address is not valid" : ''} 
            onKeyDown={(e) => {e.stopPropagation()}}
            onChange={(e: any) => {
              setWalletAddress(e.target.value);
              if (walletAddress === "") {
                setError(true);
              }
            }}          
          />
        </div>       
      </div>
      
      <DialogActions>
        <DialogButton
          variant="outlined"
          sx={{color: THEME_COLORS.get('gray700'), background: THEME_COLORS.get('white'), border: '1px solid #e5e7eb'}}
          onClick={() => {
            setWalletAddress('');
            setError(false);
            setNotValidError(false);
            setOpen(false); 
          }}
        >
          Cancel
        </DialogButton>
        <DialogButton
          variant="contained"
          sx={{background: THEME_COLORS.get('blue')}}
          onClick={() => {
            if (walletAddress === "")  {
              setError(true);
            } else if (!isAddress(walletAddress)) {
              setNotValidError(true);
            }               
            else {
              saveSharedGraphToDatabase(walletAddress);
              setOpen(false);
            }
          }}
        >
          Share Graph
        </DialogButton>
      </DialogActions>
    </DialogWindow>
  );
};

export default ShareGraphDialog;