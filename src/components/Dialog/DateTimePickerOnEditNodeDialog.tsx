import React, { useState } from "react";
import dayjs from 'dayjs';
import { ToggleButton, ToggleButtonGroup, Box } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar, TimeClock } from '@mui/x-date-pickers';
import { CalendarIcon, ClockIcon } from "assets/icons/svg";
import { styled } from "@mui/styles";
import { THEME_COLORS } from "constants/colors";

type IDialogProps = {
  nodeLabel?: string;
  setNodeLabel: Function;
};

const StyledToggleButton = styled(ToggleButton)(() => ({
  height: '32px',
  width: '100%',
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
  margin: '24px'
}));

type CurrentComponent = 'date' | 'time'; 

const DateTimePickerOnEditNodeDialog: React.FC<IDialogProps> = ({
  nodeLabel,
  setNodeLabel
}) => {

  const [currentComponent, setCurrentComponent] = useState<CurrentComponent>('date');

  const handleCurrentComponentChange = (
    event: React.MouseEvent<HTMLElement>,
    nextCurrentComponent: CurrentComponent | null,
  ) => {
    if (nextCurrentComponent !== null) {
      setCurrentComponent(nextCurrentComponent);
    }
  };  
  
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div 
        style={{
          marginLeft: '36px',
          display: 'flex',
          flexDirection:'column',
          justifyContent:'space-between',
          width: "fit-content",
          height: '368px',
          boxShadow: '0 0 8px 0 rgba(85, 85, 85, 0.1)'
        }}
      >
      
        {currentComponent === 'date' && (
          <DateCalendar 
            value={dayjs(nodeLabel, 'LLL', true).isValid() ? dayjs(nodeLabel) : dayjs()}
            onChange={(newValue: any) => {setNodeLabel(dayjs(newValue).format('LLL'))}}
          />
        )}
        {currentComponent === 'time' && (
          <Box sx={{ position: 'relative' }}>
            <TimeClock
              ampmInClock
              value={dayjs(nodeLabel, 'LLL', true).isValid() ? dayjs(nodeLabel) : dayjs()}
              onChange={(newValue: any) => {setNodeLabel(dayjs(newValue).format('LLL'))}}
              showViewSwitcher
            />
          </Box>
        )}
        
        <StyledToggleButtonGroup
          orientation="horizontal"
          value={currentComponent} 
          exclusive
          onChange={handleCurrentComponentChange}
        >
          <StyledToggleButton aria-label="date"  value={'date'}>
            <CalendarIcon />
          </StyledToggleButton>

          <StyledToggleButton aria-label="time"  value={'time'}>
            <ClockIcon />
          </StyledToggleButton>                   
        </StyledToggleButtonGroup>
      </div>        
    </LocalizationProvider>
  );
};

export default DateTimePickerOnEditNodeDialog;
