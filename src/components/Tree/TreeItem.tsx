import React from "react";
import { Box } from "@mui/material";
import { Tree } from "models";
import TreeLine from "./TreeLine";

type IGraphListProps = {
    tree: Tree;
    hoveredNodes: string[];
    selectedNodes: string[];
    setHoveredChipToVis: Function;
};

const TreeItem: React.FC<IGraphListProps> = (props) => {
  const tree = props.tree;
  
  //split tree into arrays of three nodes each
  const treeLines = [];
  let treeLine = [];
  for (let i = 0; i < tree.nodes.length; i++) {
    treeLine.push(tree.nodes[i]);
    if (treeLine.length === 8) {
      treeLines.push(treeLine);
      treeLine = [];
    }
  }
  if (treeLine.length > 0) {
    treeLines.push(treeLine);
  }

  return (
    <>
      <Box 
        sx={{ 
          display:'flex',
          flexWrap: 'wrap',
          gap: '10px',
          width: 'fit-content',
          background: 'white',
          padding: '10px',
          borderRadius:'4px',
          border: '1px solid #f5f5f5',
          boxShadow: '0 0 8px 0 rgba(85, 85, 85, 0.1)',
        }}
      >
        {treeLines !== undefined && treeLines.map((line, lineIndex) => {
          return (
              <TreeLine 
                key={lineIndex} 
                line={line} 
                hoveredNodes={props.hoveredNodes} 
                selectedNodes={props.selectedNodes} 
                setHoveredChipToVis={props.setHoveredChipToVis} 
              />
          )
          
        })}
      </Box>
    </>
  );
};

export default TreeItem;