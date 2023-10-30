import React, { useEffect, useRef } from "react";
import SmallNetwork from "../SmallNetwork";
import VisCustomNetwork from "libs/vis-custom-network";
import ProfileCreatorButton from './ProfileCreatorButton';
import { Graph } from "models";
import { THEME_COLORS } from "constants/colors";
import ProfileGraphMenu from './ProfileGraphMenu';
import { useAllUsersStore } from "store/AllUsersStore";
import { useShallow } from "zustand/react/shallow";
import { useUtensilModalStore } from "store/UtensilModalStore";

type GraphItemProps = {
  graph: Graph;
};

const ProfileGraphItem: React.FC<GraphItemProps> = ({ graph }) => {
  const networkRef = useRef<VisCustomNetwork | null>(null);

  const [setOpenUtensilModal, setSelectedGraph] = useUtensilModalStore(
    useShallow((state) => [
      state.setOpenUtensilModal,
      state.setSelectedGraph
    ])
  );
  
  const [allUsers] = useAllUsersStore(
    useShallow((state) => [
        state.allUsers,
    ])
  );
  const user = allUsers.find(el => el.address === graph.creator);

  useEffect(() => {
    const data = JSON.parse(graph.data);
    networkRef.current?.setData(data);
  },[graph])
  
  return (
    <div
      style={{
        minWidth: '438px',
        display:'flex',
        gap:'16px'
      }}
    >
      <div
        style={{cursor:'pointer'}}
        onClick={() => {setSelectedGraph(graph); setOpenUtensilModal(true)}}
      >
        <SmallNetwork networkRef={networkRef} width={'216px'} height={'160px'} /> 
      </div>
      <div
        style={{width: '206px', padding:'16px 0', display:'flex', flexDirection:'column', justifyContent:'space-between'}}
      >
        <div 
          style={{display:'flex',flexDirection:'column', gap:'12px', cursor:'pointer'}}
          onClick={() => {setSelectedGraph(graph); setOpenUtensilModal(true)}}
        >
          <div
            style={{fontWeight:'500',fontSize:'1rem', color:THEME_COLORS.get('black'), overflowWrap: 'break-word'}}
          >
            {graph.name}
          </div>
          <div
            style={{
              fontWeight:'400', 
              fontSize:'0.875rem', 
              color:THEME_COLORS.get('darkGray'),
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient:'vertical',
              overflow: 'hidden',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word', 
            }}
          >
            {graph.note}
          </div>
        </div>
        <div style={{height:'1.75rem', display:'flex', justifyContent:'start', gap:'4px'}}>
          <ProfileCreatorButton creator={user!} />
          <ProfileGraphMenu graph={graph} />
        </div>
      </div>
    </div>
     
    );
};

export default ProfileGraphItem;
