import React, { useEffect, useRef } from "react";
import SmallNetwork from "./SmallNetwork";
import VisCustomNetwork from "libs/vis-custom-network";

type GraphItemProps = {
  graphData: any;
};

const ProfileGraphItem: React.FC<GraphItemProps> = ({
  graphData
}) => {
  const networkRef = useRef<VisCustomNetwork | null>(null);
  
  useEffect(() => {
    const data = JSON.parse(graphData);
    networkRef.current?.setData(data);
  },[graphData])
  
  return (
      <SmallNetwork networkRef={networkRef} /> 
    );
};

export default ProfileGraphItem;
