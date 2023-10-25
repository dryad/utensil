import React, {useState, useEffect, Dispatch, SetStateAction} from 'react';
import { Radio, RadioGroup, FormControl, FormControlLabel, RadioProps } from "@mui/material";
import { DialogTitle, DialogActions, DialogWindow, InputField, DialogButton } from ".";
import { styled } from '@mui/styles';
import { THEME_COLORS } from 'constants/colors';
import { useShallow } from 'zustand/react/shallow'
import { useGraphStore } from 'store/GraphStore';

interface DialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  saveGraphToDatabase: () => void;
  closeBar: Function | null;
  setIsMessageWindowOpen: Function;
  canBePrivateGraph: boolean;
}

const StIcon = styled('span')(() => ({
  borderRadius: '50%',
  width: 16,
  height: 16,
  border: '1px solid #e5e7eb',
}));

const StCheckedIcon = styled(StIcon)({
  backgroundColor: '#3b82f6',
  border: '1px solid #3b82f6',
  '&:before': {
    display: 'block',
    position:'relative',
    top: '4px',
    left:"4px",
    width: 6,
    height: 6,
    background: 'white',
    borderRadius: '50%',
    content: '""',
  },
});

function StRadio(props: RadioProps) {
  return (
    <Radio
      disableRipple
      checkedIcon={<StCheckedIcon />}
      icon={<StIcon />}
      {...props}
    />
  );
}

const EditGraphDialog = (props: DialogProps) => {
  const { open, setOpen, saveGraphToDatabase, closeBar, setIsMessageWindowOpen, canBePrivateGraph } = props;
  const [graphName, graphNote, isPrivate, setGraphName, setGraphNote, setIsPrivate, prevGraphName, prevGraphNote, prevGraphPrivate] = useGraphStore(
    useShallow((state) => [
      state.graphName, 
      state.graphNote,
      state.isPrivate,
      state.setGraphName,
      state.setGraphNote,
      state.setIsPrivate,
      state.prevGraphName,
      state.prevGraphNote,
      state.prevGraphPrivate,      
    ])
  );

  const [error, setError] = useState(false);
  
  useEffect(() => {
    if (graphName !== "")  {
      setError(false);
    } 
  }, [graphName]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrivate((event.target as HTMLInputElement).value === 'Private');
  };
  
  return (
    <DialogWindow
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="edit-graph-dialog"
      width={'420px'}
    >
      <DialogTitle 
        id="edit-graph-dialog" 
        onClose={() => {
          setIsPrivate(prevGraphPrivate); 
          setGraphName(prevGraphName);
          setGraphNote(prevGraphNote);
          setOpen(false);
        }}
      >
        Edit graph info 
      </DialogTitle>
    
      <div>
        <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
          <div style={{fontSize:"0.9375rem", fontWeight:'500', color: "#191919"}}>
            Graph name
          </div>
          <InputField
            id="outlined-basic"
            variant="outlined"
            value={graphName}
            placeholder='Enter name'
            error={error}
            helperText={error ? "Graph name required" : " "} 
            onKeyDown={(e) => {e.stopPropagation()}}
            onChange={(e: any) => {
              setGraphName(e.target.value);
              if (graphName === "") {
                setError(true);
              }
            }}          
          />
        </div>
        
        <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
          <div style={{fontSize:"0.9375rem", fontWeight:'500', color: "#191919"}}>
            Note
          </div>
          <InputField
            id="outlined-basic"
            variant="outlined"
            placeholder='Add note'
            value={graphNote}
            onKeyDown={(e) => {e.stopPropagation()}}
            onChange={(e: any) => setGraphNote(e.target.value)}
          />
        </div>

        <FormControl sx={{paddingTop:'16px'}}>
          <RadioGroup
            row
            aria-labelledby="radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={isPrivate ? 'Private' : 'Public'}
            onChange={handleChange}
          >
            <FormControlLabel 
              value="Public" 
              control={<StRadio />} 
              label="Public" 
              disabled={!canBePrivateGraph}
              sx={{height:'20px'}}
            />
            <FormControlLabel 
              value="Private" 
              control={<StRadio />} 
              label="Private" 
              disabled={!canBePrivateGraph}
              sx={{height:'20px'}}
            />
          </RadioGroup>
        </FormControl>
      </div>
      
      <DialogActions>
        <DialogButton
          variant="outlined"
          sx={{color: THEME_COLORS.get('gray700'), background: THEME_COLORS.get('white'), border: '1px solid #e5e7eb'}}
          onClick={() => {
            setIsPrivate(prevGraphPrivate); 
            setGraphName(prevGraphName);
            setGraphNote(prevGraphNote);
            setError(false);
            setOpen(false); 
          }}
        >
          Cancel
        </DialogButton>
        <DialogButton
          variant="contained"
          sx={{background: THEME_COLORS.get('blue')}}
          onClick={() => {
            if (graphName === "")  {
              setError(true);
            } else {
              saveGraphToDatabase();
              setOpen(false);
              closeBar && closeBar();
              setIsMessageWindowOpen(true);
            }
          }}
        >
          Save
        </DialogButton>
      </DialogActions>
    </DialogWindow>
  );
};

export default EditGraphDialog;