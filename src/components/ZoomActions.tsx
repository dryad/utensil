import React, {useState} from 'react'
import { ZoomInIcon, ZoomOutIcon } from '../assets/icons/svg';

function ZoomActions() {
    const [zoomValue, setZoomValue] = useState(100);

    return (
        <div
            style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                width:'169px',
                height:'55px',
                display: 'flex',
                justifyContent:'space-between',
                alignItems:'center',
                gap: '2px',
                padding: '4px',
                background: 'white',
                borderRadius: '4px'
            }}
        >
            <div style={{padding: '16px', display:'flex', alignItems:'center'}}>
                <ZoomOutIcon />
            </div>
            <div style={{padding: '16px', fontSize:'12px', fontWeight:'500'}}>
                {zoomValue}%
            </div>
            <div style={{padding: '16px', display:'flex', alignItems:'center'}}>
                <ZoomInIcon />
            </div>
        </div>
    )
}

export default ZoomActions