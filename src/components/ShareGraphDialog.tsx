import React, {useState, useEffect, Dispatch, SetStateAction} from 'react';
import { Button, Dialog, Box, TextField } from "@mui/material";
import { DialogTitle, DialogActions } from "./Dialog";
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface DialogProps {
  children: React.ReactNode;
  openShareGraphDialog: boolean;
  setOpenShareGraphDialog: Dispatch<SetStateAction<boolean>>;
  graphName: string;
  saveSharedGraphToDatabase: (value: string) => void;
}

const theme = createTheme({
  palette: {
      background: {
          default: "#ffffff"
        },
      primary: {
          main: "#1976d2",
          contrastText: "#8732f5",
      },
      secondary: {
          main: "#f44336",
          contrastText: "#fff",
      },
      error: {
          main: "#f44336",
          contrastText: "#fff",
      },
      warning: {
          main: "#ff9800",
      },
      info: {
          main: "#2196f3",
          contrastText: "#fff",
      },
      success: {
          main: "#4caf50",
          contrastText: "#fff",
      },
      contrastThreshold: 3,
      tonalOffset: 0.2,
  },
});

const ShareGraphDialog = (props: DialogProps) => {
  const { openShareGraphDialog, setOpenShareGraphDialog, graphName,  saveSharedGraphToDatabase } = props;
  const [error, setError] = useState(false);
  const [notValidError, setNotValidError] = useState(false);
  const [address, setAddress] = useState('');
  
  useEffect(() => {
    if (address !== "")  {
      setError(false);
    } 
    if (isAddress(address)) {
      setNotValidError(false);
    }
  }, [address]);

  useEffect(() => {
    setAddress(''); 
  },[openShareGraphDialog]);

  const isAddress = function (address: string) {
    // check if it has the basic requirements of an address

    if (/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        return true;
    } else {
        return false;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={openShareGraphDialog}
        onClose={() => setOpenShareGraphDialog(false)}
        aria-labelledby="share-graph-dialog"
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "27rem",  
            },
          },
        }}
      >
        <DialogTitle id="share-graph-dialog" sx={{color: '#999', display: 'flex', justifyContent: 'center'}}>
          SHARE GRAPH          
        </DialogTitle>
        <Box mx={1} my={1} >
          <TextField
            id="outlined-basic"
            label="Graph name"
            variant="outlined"
            size="small"
            fullWidth
            value={graphName}
          />
        </Box>
        <Box mx={1} >
          <TextField
            id="outlined-basic"
            label="Address"
            variant="outlined"
            size="small"
            fullWidth
            value={address}
            error={error && notValidError}
            helperText={error ? "Address required" : notValidError ? "Address is not valid" : ''} 
            onChange={(e: any) => {
              setAddress(e.target.value);
              if (address === "") {
                setError(true);
              }
            }}          
          />
        </Box>
        <DialogActions>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              setAddress('');
              setError(false);
              setNotValidError(false);
              setOpenShareGraphDialog(false); 
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              if (address === "")  {
                setError(true);
              } else if (!isAddress(address)) {
                setNotValidError(true);
              }               
              else {
                saveSharedGraphToDatabase(address);
                setOpenShareGraphDialog(false);
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};
export default ShareGraphDialog;