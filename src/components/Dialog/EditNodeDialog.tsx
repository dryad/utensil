import React, { useState, useEffect, useRef } from "react";
import dayjs from 'dayjs';
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { DialogTitle, DialogActions, DialogWindow, InputField, DialogButton } from ".";
import { Graph } from "models";
import GraphItemOnEditNodeDialog from "./GraphItemOnEditNodeDialog";
import DateTimePickerOnEditNodeDialog from './DateTimePickerOnEditNodeDialog';
import { CalendarIcon, TextIcon } from "assets/icons/svg";
import { styled } from "@mui/styles";
import { THEME_COLORS } from "constants/colors";

type IDialogProps = {
  open: boolean;
  title?: string;
  nodeLabel?: string;
  onClose: Function;
  onOk: Function;
  setNodeLabel: Function;
  graphs: any;
  handleGraphImport: Function;
};

const StyledToggleButton = styled(ToggleButton)(() => ({
  height: '32px',
  width: '39px',
  background: 'white', 
  color: THEME_COLORS.get("darkGray"),
  border: 'none',
  borderRadius: '4px',
  padding: '5px',
  ':hover': {
      border: 'none',
      borderRadius: '4px',
      background: '#f5f5f5',
  },
  ':hover&.Mui-selected': {
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#f5f5f5',
  },
  '&.Mui-selected': {
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#f5f5f5',
  },  
}))

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(() => ({
  border: '1px solid #f5f5f5',
}));

const LabelField = styled(InputField)({
  '& .MuiInputBase-root': {
    fontSize: '0.75rem',
  },  
});

const StyledRow = styled('div')(() => ({
  height:'99px',
  display:'flex',
  alignItems:'center',
  justifyContent:'space-between',
  padding:'8px 0',
  borderBottom: '1px solid #f5f5f5',
  '&:last-of-type': { borderBottom: 0 }
}));

const StyledBox = styled('div')(() => ({
  overflowY:'auto', 
  '&::-webkit-scrollbar':{
    width: '7px',
	},
  '&::-webkit-scrollbar-thumb': {
		background: THEME_COLORS.get('lightGray'),    
		borderRadius: '20px',
		'&:hover': {
			background: THEME_COLORS.get('gray')     
		}
	}  
}))

const EditNodeDialog: React.FC<IDialogProps> = ({
  open,
  nodeLabel,
  onClose,
  onOk,
  setNodeLabel,
  graphs,
  handleGraphImport
}) => {
  const [filteredGraphs, setFilteredGraphs] = useState([]);
  const [showGraphsList, setShowGraphsList] = useState(true);
  const [inputValue, setInputValue] = useState('Label');
  const okButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {setShowGraphsList(true)},[open]);

  useEffect(() => {setInputValue('Label')},[open]);

  useEffect(() => {
    setNodeLabel(nodeLabel);

    if (nodeLabel && nodeLabel?.trim().length > 0) {
      const tempGraphs = graphs.filter((el: Graph) => {
        if (el.name.toLowerCase().trim().includes(nodeLabel.toLowerCase())) {
          return el
        }
      })
      setFilteredGraphs(tempGraphs);
    } else {
      setFilteredGraphs([]);
    }

  }, [nodeLabel]);

  const handleImportButton = (graphId: any) => {
    const canBeGraphReplaced = handleGraphImport(graphId); 
    console.log('canBeGraphReplaced', canBeGraphReplaced);

    if (canBeGraphReplaced) {
      onClose();
    } else {
      setShowGraphsList(false);
    }
  }

  const handleChange = (event: React.MouseEvent<HTMLElement>, mode: string) => {
    if (mode !== null) {
      setInputValue(mode);
    }
    if (mode === 'Date' && !dayjs(nodeLabel, 'LLL', true).isValid()) {
      setNodeLabel('');
    }
  };
  
  return (
    <DialogWindow
      open={open}
      onClose={onClose}
      aria-labelledby="edit-node-dialog"
      width={'494px'}
      position={'fixed'}
      positionTop={'0'}
      gap={'16px'}
    >
      <DialogTitle 
        id="edit-node-dialog" 
        onClose={onClose}
      >
        Edit Node 
      </DialogTitle>

      <div style={{display:'flex', alignItems:'center', gap: '8px'}}>
        <span style={{fontSize:'0.75rem', fontWeight:'500', color:'#6b7280'}}>
          Input type
        </span>

        <StyledToggleButtonGroup
          orientation="horizontal"
          value={inputValue} 
          exclusive
          onChange={handleChange}
        >
          <StyledToggleButton aria-label="text"  value="Label">
            <TextIcon />
          </StyledToggleButton>

          <StyledToggleButton aria-label="date"  value="Date">
            <CalendarIcon />
          </StyledToggleButton>                   
        </StyledToggleButtonGroup>
      </div>

      <div style={{display:'flex', alignItems:'center', gap: '8px'}}>
        <span style={{fontSize:'0.75rem', fontWeight:'500', color:'#6b7280'}}>
          {inputValue}
        </span>

        <LabelField
          id="label"
          variant="outlined"
          fullWidth
          autoFocus
          value={nodeLabel}
          placeholder= {inputValue === 'Label' ? 'Enter node title' : 'Select date/time'}
          onKeyDown={e => {
            e.stopPropagation();
            if (e.key === 'Enter') { okButton.current?.click(); }
          }} 
          onChange={(e) => {
            setNodeLabel(e.target.value);
          }}   
          onFocus={event => {
            event.target.select();
          }}  
        />
              
        <DialogActions>
          <DialogButton
            ref={okButton}
            variant="contained"
            sx={{background: THEME_COLORS.get('blue')}}
            onClick={onOk(nodeLabel)}
          >
            Save
          </DialogButton>
        </DialogActions>
      </div>
      {inputValue === 'Date' &&
        <DateTimePickerOnEditNodeDialog nodeLabel={nodeLabel} setNodeLabel={setNodeLabel}/>
      }

      {showGraphsList && (
        <StyledBox>
          {filteredGraphs.map((graph: Graph) => (
            <StyledRow key={graph.id}>
              <GraphItemOnEditNodeDialog 
                graph={graph} 
                handleImportButton={handleImportButton}
              />
            </StyledRow>                         
          ))}
        </StyledBox>
      )}
    </DialogWindow>
  );
};

export default EditNodeDialog;
