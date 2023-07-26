import React, {useState, useEffect, Dispatch, SetStateAction} from 'react';
import { Button, Dialog, Box, TextField, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel } from "@mui/material";
import { DialogTitle, DialogActions } from "./Dialog";
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface DialogProps {
  children: React.ReactNode;
  openSaveGraphDialog: boolean;
  setOpenSaveGraphDialog: Dispatch<SetStateAction<boolean>>;
  graphName: string;
  setGraphName: Dispatch<SetStateAction<string>>;
  graphNote: string;
  setGraphNote: Dispatch<SetStateAction<string>>;
  prevGraphName: string;
  prevGraphNote: string;
  prevGraphPrivate: boolean;
  setIsPrivate: Dispatch<SetStateAction<boolean>>;
  saveGraphToDatabase: (value: boolean) => void;
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

const SaveGraphDialog = (props: DialogProps) => {
  const { openSaveGraphDialog, setOpenSaveGraphDialog, graphName, setGraphName, graphNote, setGraphNote, prevGraphName, prevGraphNote, prevGraphPrivate, setIsPrivate, saveGraphToDatabase } = props;
  const [error, setError] = useState(false);
  const [value, setValue] = useState('Public');
  
  useEffect(() => {
    if (graphName !== "")  {
      setError(false);
    } 
  }, [graphName]);

  useEffect(() => {
    openSaveGraphDialog && setIsPrivate(() => {return value === "Private"});
  }, [value]);

  useEffect(() => {
    setValue('Public'); 
  },[openSaveGraphDialog])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={openSaveGraphDialog}
        onClose={() => setOpenSaveGraphDialog(false)}
        aria-labelledby="save-graph-dialog"
      >
        <DialogTitle id="save-graph-dialog" sx={{color: '#999', display: 'flex', justifyContent: 'center'}}>SAVE GRAPH </DialogTitle>
      
        <Box mx={1} >
          <TextField
            id="outlined-basic"
            label="Graph Name"
            variant="outlined"
            size="small"
            fullWidth
            value={graphName}
            error={error}
            helperText={error ? "Graph name required" : " "} 
            onChange={(e: any) => {
              setGraphName(e.target.value);
              if (graphName === "") {
                setError(true);
              }
            }}          
          />
        </Box>
        <Box m={1}>
          <TextField
            id="outlined-basic"
            label="Note"
            multiline
            rows={4}
            variant="outlined"
            size="small"
            fullWidth
            value={graphNote}
            onChange={(e: any) => setGraphNote(e.target.value)}
          />
        </Box>      
        <Box mx={1}>
          <FormControl>
            <FormLabel id="radio-buttons-group">Accessibility</FormLabel>
            <RadioGroup
              row
              aria-labelledby="radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
            >
              <FormControlLabel value="Public" control={<Radio size="small"/>} label="Public" />
              <FormControlLabel value="Private" control={<Radio size="small"/>} label="Private" />
            </RadioGroup>
          </FormControl>
        </Box>      

        <DialogActions>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              setIsPrivate(() => prevGraphPrivate); 
              setGraphName(prevGraphName);
              setGraphNote(prevGraphNote);
              setError(false);
              setOpenSaveGraphDialog(false); 
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              if (graphName === "")  {
                setError(true);
              } else {
                saveGraphToDatabase(true);
                setOpenSaveGraphDialog(false);
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
export default SaveGraphDialog;