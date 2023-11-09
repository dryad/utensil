import { CloseIcon } from "../assets/icons/svg";

type Props = {
  closeMessage: () => void;
  title: string;
  message: string;
}

function GraphMenuMessage({closeMessage, title, message}: Props) {

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
          {title}
        </div>
        <div
          style={{cursor:'pointer', display:'flex', alignItems:'center', color: "#6b7280", transform: 'scale(0.8)'}}
          onClick={closeMessage}
        >
          <CloseIcon />
        </div>
      </div>
      <div style={{fontSize:'0.875rem', color: '#6b7280'}}>
        {message}
      </div>
    </div>
  )
}

export default GraphMenuMessage