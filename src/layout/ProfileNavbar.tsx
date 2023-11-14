import MetaMaskButton from 'components/MetaMaskButton';
import { styled } from '@mui/material/styles';

const StyledBar = styled('div')(() => ({
  display: 'flex',
  alignItems:'center',
  justifyContent:'center',
}));

const StyledMetaMaskButton = styled('div')(() => ({
  height:'55px',
  display: 'flex',
  justifyContent:'center',
  alignItems:'center',
  gap: '2px',
  padding: '4px',
  background: 'white',
  borderRadius: '4px'
}));

function ProfileNavbar() {
  
  return (
    <>
      <StyledBar>
        <div
          style={{
            marginLeft:'auto',
            marginRight: '16px',
            display: 'flex',
            justifyContent:'flex-end',
            gap:'8px'
          }}
        >
          <StyledMetaMaskButton>
            <MetaMaskButton />
          </StyledMetaMaskButton>  
        </div>
      </StyledBar>
    </>   
  )
}

export default ProfileNavbar