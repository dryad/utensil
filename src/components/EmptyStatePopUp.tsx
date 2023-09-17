import { Dispatch, SetStateAction } from 'react'
import { CloseIcon, ImgForEmptyState } from '../assets/icons/svg';
import Button from '@mui/material/Button';
import { THEME_COLORS } from "constants/colors";

type Props = {
    setIsEmptyState: Dispatch<SetStateAction<boolean>>;
    setIsAddShapeButtonClicked: Dispatch<SetStateAction<boolean>>;
}

function EmptyStatePopUp({setIsEmptyState, setIsAddShapeButtonClicked}: Props) {

  return (
    <div
        style={{
            width:'218px',
            height: '247px',
            background: "white",
            padding: '2rem',
            borderRadius: "1rem",
            display: "flex",
            flexDirection: 'column',
            justifyContent: "start",
            alignItems: 'center',
            gap: '1rem',
            position: 'relative'
        }}
    >
        <div
            style={{cursor: 'pointer', position:'absolute', top: '1rem', right:'1rem'}}
            onClick={() => {setIsEmptyState(false)}} 
        > 
            <CloseIcon />
        </div>

        <ImgForEmptyState />
        
        <div 
            style={{
                fontSize:'1.125rem',
                fontWeight:'500',
                color: THEME_COLORS.get("black"),
                paddingTop: '12px',
                lineHeight: "23px",
                textAlign:'center'
            }}
        >
            Add new shape to start building
        </div>

        <Button 
            variant="contained" 
            sx={{
                background: THEME_COLORS.get("blue"),
                textTransform: 'none',
                width: '89px',
                height:'30px',
                fontSize:"12px",
                weight:'500',
                padding:"4px 8px",
                margin:'0'
            }}
            onClick={() => { 
                setIsEmptyState(false);
                setIsAddShapeButtonClicked(true);
            }}
        >
            Add a shape
        </Button>
    </div>
  )
}

export default EmptyStatePopUp