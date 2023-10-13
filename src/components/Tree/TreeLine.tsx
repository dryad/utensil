import React from "react";
import { TreeNode } from "models";
import { styled } from '@mui/material/styles';
import { THEME_COLORS } from "constants/colors";

type IGraphListProps = {
    line: TreeNode[];
    hoveredNodes: any;
    selectedNodes: any;
    setHoveredChipToVis: Function;
};

const StyledNode = styled('div')`
  &:hover {
    color: THEME_COLORS.get('blue')
  }
`;
const TreeLine: React.FC<IGraphListProps> = (props) => {
  const line = props.line;

  const onClick = (node: TreeNode) => {
    props.setHoveredChipToVis(node.id)
  }
  const onHover = (node: TreeNode) => {
    props.setHoveredChipToVis(node.id);
  }
  const onLeave = (node: TreeNode) => {
    props.setHoveredChipToVis(null);
  }

  return (
    <>
      {line.map((node, nodeIndex) => {
        return (
          <StyledNode
            sx={{ 
              fontSize: '0.75rem',
              lineHeight: '1rem',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 2px',
              color: props.selectedNodes.current?.includes(node.id) 
                ? THEME_COLORS.get("blue") 
                : props.hoveredNodes.current?.includes(node.id) 
                  ? THEME_COLORS.get("blue") 
                  : THEME_COLORS.get("black"),
              background: props.selectedNodes.current?.includes(node.id) 
                ? 'rgba(245, 245, 245, 1)' 
                : props.hoveredNodes.current?.includes(node.id) 
                  ? 'rgba(245, 245, 245, 1)' 
                  : '',
              border: props.selectedNodes.current?.includes(node.id) 
              ? '1px solid rgba(141, 121, 255, 1)' 
              : props.hoveredNodes.current?.includes(node.id) 
                ? '1px solid rgba(141, 121, 255, 1)'  
                : 'none',
              borderRadius: props.selectedNodes.current?.includes(node.id) 
              ? '4px' 
              : props.hoveredNodes.current?.includes(node.id) 
                ? '4px'  
                : '',  
            }}
            key={nodeIndex}
            onClick={() => {
              onClick(node);
            }}
            onMouseEnter={() => {
              onHover(node);
            }}
            onMouseLeave={() => {
              onLeave(node);
            }}        
          >
            {node.label}
          </StyledNode>
        )          
      })}
    </>
  )
};

export default TreeLine;