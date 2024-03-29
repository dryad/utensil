import React, {useEffect, useState} from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { HomeIcon, FileIcon } from '../assets/icons/svg';
import { THEME_COLORS } from "constants/colors";
import { useMetaMaskAccountStore } from 'store/MetaMaskAccountStore';
import { useShallow } from 'zustand/react/shallow';

function PageSwitcher() {
    let navigate = useNavigate();
    const location = useLocation();
	const path = location.pathname.split('/')[1];
    const [page, setPage] = useState('/' + path);

    const [metaMaskAccount, getMetaMaskAccount] = useMetaMaskAccountStore(
        useShallow((state) => [
          state.metaMaskAccount,
          state.getMetaMaskAccount,
        ])
      );
    
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
                background: THEME_COLORS.get("white"),
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
                    background: page === '/profile' ? THEME_COLORS.get("darkGray") : THEME_COLORS.get("white"),
                    color: page === '/profile' ? THEME_COLORS.get("white") : THEME_COLORS.get("black")
                }}
                onClick={(e) => togglePage(e, `/profile/${metaMaskAccount}`)}
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
                    background: page === '/utensil' ? THEME_COLORS.get("darkGray") : THEME_COLORS.get("white"),
                    color: page === '/utensil' ? THEME_COLORS.get("white") : THEME_COLORS.get("black")
                }}
                onClick={(e) => togglePage(e, '/utensil')}
            >
                <FileIcon />
            </div>
        </div>
    )
}

export default PageSwitcher