import React, {useEffect, useState} from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { HomeIcon, FileIcon } from '../assets/icons/svg';

function PageSwitcher() {
    let navigate = useNavigate();
    const location = useLocation();
	const path = location.pathname.split('/')[1];
    const [page, setPage] = useState('/' + path);
    
    useEffect(() => {
        setPage('/' + path);
    },[path])

    const togglePage = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        path: string
    ) => {
        setPage(path);
        navigate(path);
    }

    return (
        <div 
            style={{
                width:'106px', 
                height:'55px', 
                borderRadius: '45px', 
                background:'white',
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
                cursor:'pointer'
            }}
        >
            <div 
                style={{
                    width:'47px', 
                    height:'47px', 
                    borderRadius: '45px',
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center',
                    background: page === '/profile' ? '#4b5563' : 'white',
                    color: page === '/profile' ? 'white' : '#191919'
                }}
                onClick={(e) => togglePage(e, '/profile')}
            >
                <HomeIcon />
            </div>
            <div
                style={{
                    width:'47px', 
                    height:'47px', 
                    borderRadius: '45px',
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center',
                    background: page === '/utensil' ? '#4b5563' : 'white',
                    color: page === '/utensil' ? 'white' : '#191919'
                }}
                onClick={(e) => togglePage(e, '/utensil')}
            >
                <FileIcon />
            </div>
        </div>
    )
}

export default PageSwitcher