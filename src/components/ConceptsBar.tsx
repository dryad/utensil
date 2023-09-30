import { Box } from '@mui/material';
import { CloseIcon } from 'assets/icons/svg';
import { THEME_COLORS } from "constants/colors";
import TreeList from './Tree/TreeList';
import { styled } from '@mui/material/styles';

type Props = {
  closeBar: () => void;
  trees: any;
  hoveredNodes: any;
  selectedNodes: any; 
  setHoveredChipToVis: any;
}

const StyledBox = styled(Box)(() => ({
  overflowY:'auto', 
  height: '100%',
  paddingTop: "1rem",
  '&::-webkit-scrollbar':{
    width: '8px',
	},
  '&::-webkit-scrollbar-thumb': {
		background: THEME_COLORS.get('lightGray'),
		borderRadius: '20px',
		':hover': {
			background: THEME_COLORS.get('darkGray')
		}
	}  
}))

function ConceptsBar({closeBar, trees, hoveredNodes, selectedNodes, setHoveredChipToVis}: Props) {
  return (
    <div 
      style={{
        position:'absolute', 
        top:'71px', 
        right:'16px',
        bottom: '79px', 
        zIndex:'10',
        width: '295px',
        background:'white',
        padding: '20px'
      }}
    >
      <div 
        style={{
          cursor:'pointer',
          position: "absolute",
          top:'1rem',
          right: "1rem"
        }}
        onClick={closeBar}
      >
        <CloseIcon />
      </div>
      <div style={{fontWeight:'500', fontSize:'0.875rem'}}>
        Concepts
      </div>
      
      <StyledBox>
        <TreeList 
          trees={trees} 
          hoveredNodes={hoveredNodes} 
          selectedNodes={selectedNodes} 
          setHoveredChipToVis={setHoveredChipToVis}
        />
      </StyledBox>
    </div>
  )
}

export default ConceptsBar