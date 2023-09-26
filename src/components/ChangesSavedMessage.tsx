import { useEffect, useState } from 'react';
import { CloseIcon } from "../assets/icons/svg";

type Props = {
  closeMessage: () => void;
  startDate: Date;
}

function ChangesSavedMessage({closeMessage, startDate}: Props) {

  const [curDate, setCurDate] = useState(new Date());
  const [minutesAgo, setMinutesAgo] = useState(1);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurDate(new Date());
    }, 60000)

    return () => clearInterval(intervalId);
  }, [])

  useEffect(() => {
    let difference = curDate.getTime() - startDate.getTime();
    setMinutesAgo(Math.round((difference/1000)/60));
  },[curDate])

  return (
    <div 
      style={{
        position:'absolute', 
        top:'71px', 
        right:'16px',
        zIndex:'10',
        display:'flex',
        flexDirection:'column',
        gap:'5px',
        width: '21.25rem',
        borderRadius: '8px',
        padding:'16px',
        background:'white',
        boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{fontSize:'0.875rem', fontWeight:'600', color:'#111827'}}>
          Changes saved
        </div>
        <div style={{marginLeft:'auto', marginRight: '16px', color:"#6b7280", fontSize:'0.875rem'}}>
          {minutesAgo} min ago
        </div>
        <div
          style={{cursor:'pointer', display:'flex', alignItems:'center', color: "#6b7280", transform: 'scale(0.8)'}}
          onClick={closeMessage}
        >
          <CloseIcon />
        </div>
      </div>
      <div style={{fontSize:'0.875rem', color: '#6b7280'}}>
        All changes in your graph were saved.
      </div>
    </div>
  )
}

export default ChangesSavedMessage