import React, {useState, useEffect, Dispatch, SetStateAction} from 'react';
import { Radio, RadioGroup, FormControl, FormControlLabel, RadioProps } from "@mui/material";
import { DialogTitle, DialogActions, DialogWindow, InputField, DialogButton } from ".";
import { styled } from '@mui/styles';
import { THEME_COLORS } from 'constants/colors';

interface DialogProps {
  openEditGraphDialog: boolean;
  setOpenEditGraphDialog: Dispatch<SetStateAction<boolean>>;
  setOpenCancelEditGraphDialog: Dispatch<SetStateAction<boolean>>;
  graphName: string;
  setGraphName: Dispatch<SetStateAction<string>>;
  graphNote: string;
  setGraphNote: Dispatch<SetStateAction<string>>;
  prevGraphName: string;
  prevGraphNote: string;
  prevGraphPrivate: boolean;
  isPrivate: boolean;
  setIsPrivate: Dispatch<SetStateAction<boolean>>;
  saveGraphToDatabase: () => void;
}

const StIcon = styled('span')(({ theme }) => ({
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
  const { openEditGraphDialog, setOpenEditGraphDialog, setOpenCancelEditGraphDialog, graphName, setGraphName, graphNote, setGraphNote, prevGraphName, prevGraphNote, prevGraphPrivate, isPrivate, setIsPrivate, saveGraphToDatabase } = props;
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
      open={openEditGraphDialog}
      onClose={() => setOpenEditGraphDialog(false)}
      aria-labelledby="edit-graph-dialog"
      width={'420px'}
    >
      <DialogTitle 
        id="edit-graph-dialog" 
        onClose={() => {
          setIsPrivate(() => prevGraphPrivate); 
          setGraphName(prevGraphName);
          setGraphNote(prevGraphNote);
          setOpenEditGraphDialog(false);
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
            <FormControlLabel value="Public" control={<StRadio />} label="Public" sx={{height:'20px'}}/>
            <FormControlLabel value="Private" control={<StRadio />} label="Private" sx={{height:'20px'}}/>
          </RadioGroup>
        </FormControl>
      </div>
      
      <DialogActions>
        <DialogButton
          variant="outlined"
          sx={{color: THEME_COLORS.get('gray700'), background: THEME_COLORS.get('white'), border: '1px solid #e5e7eb'}}
          onClick={() => {
            if (
              prevGraphName !== graphName || 
              prevGraphNote !== graphNote || 
              prevGraphPrivate !== isPrivate
            ) {
              setOpenCancelEditGraphDialog(true);
            }
            setError(false);
            setOpenEditGraphDialog(false); 
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
              setOpenEditGraphDialog(false);
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