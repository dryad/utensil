import { InfoLabelIcon } from '../assets/icons/svg';
import { THEME_COLORS } from "constants/colors";
import { styled } from '@mui/material/styles';
import { useMetaMaskAccountStore } from 'store/MetaMaskAccountStore';
import { useShallow } from 'zustand/react/shallow';

const StyledBox = styled('div')(() => ({
    width:'420px',
    background: "white",
    padding: '20px',
    borderRadius: "1rem",
    display: "flex",
    flexDirection: 'column',
    justifyContent: "start",
    alignItems: 'center',
    gap: '20px',
    position: 'relative'
  }));

const StyledMetaMaskButton = styled('div')(() => ({
    height:'2.25rem',
    display: 'flex',
    justifyContent:'center',
    alignItems:'center',
    gap: '2px',
    padding: '1rem',
    background: THEME_COLORS.get("blue"),
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer'
  }));

const MetaMaskButton = () => {
    const [getMetaMaskAccount] = useMetaMaskAccountStore(
        useShallow((state) => [
          state.getMetaMaskAccount,
        ])
      );

    return (
    <>
        {window.ethereum &&
          <div
            style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', padding: '4px 15px'}}
          > 
            {window.ethereum.isMetaMask && !window.ethereum.selectedAddress && (
              <>
                <StyledMetaMaskButton 
                  onClick={() => getMetaMaskAccount()} 
                >
                  Connect Wallet
                </StyledMetaMaskButton>
              </>                
            )}
          </div>
        }        
        {!window.ethereum && (
            <a href="https://metamask.io/"
                style={{textDecoration: 'none'}}
            >
                <StyledMetaMaskButton>
                    Get MetaMask to Connect
                </StyledMetaMaskButton>  
            </a>                    
        )}
      </>  
)}  

const EmptyProfilePopUp = () => {
  return (
    <StyledBox>
        <InfoLabelIcon />
        <div 
            style={{
                fontSize:'1.125rem',
                fontWeight:'500',
                color: THEME_COLORS.get("black"),
                lineHeight: "23px",
                textAlign:'center'
            }}
        >
            Connect your wallet first
        </div>
        <div 
            style={{
                fontSize:'0.875rem',
                color: THEME_COLORS.get("gray500"),
                lineHeight: "20px",
                textAlign:'center'
            }}
        >
            You can't access your Profile, if you don't have an account. 
            Connect your wallet to create an account.
        </div>

        <MetaMaskButton /> 
    </StyledBox>
  )
}

export default EmptyProfilePopUp