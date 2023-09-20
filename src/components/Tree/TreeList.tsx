import React from "react";
import { Tree } from "models";
import TreeItem from "./TreeItem";

type IGraphListProps = {
    trees: Tree[];
    hoveredNodes: string[];
    selectedNodes: string[];
    setHoveredChipToVis: Function;
};

const TreeList: React.FC<IGraphListProps> = (props) => {
  const trees = props.trees;
 
  return (
    <>
      {trees && trees.map((tree, index) => {
        return (
          <div 
            key={index} 
            style={{
              display:'flex',
              flexDirection:'column',
              justifyContent:'flex-start',
              margin:'8px 0 0'
            }}
          >
            <TreeItem 
              tree={tree} 
              hoveredNodes={props.hoveredNodes} 
              selectedNodes={props.selectedNodes} 
              setHoveredChipToVis={props.setHoveredChipToVis}
            />
          </div>
        )
      })}
    </>
  );
};

export default TreeList;