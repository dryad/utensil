import { Avatar, Button, Stack } from '@mui/material';
import { useMetaMaskAccountStore } from "store/MetaMaskAccountStore";
import { useShallow } from "zustand/react/shallow";
import { THEME_COLORS } from "constants/colors";
import { useEffect, useState } from 'react';
import GraphMenuMessage from './GraphMenuMessage';
import EditProfileDialog from "components/Dialog/EditProfileDialog";

function ProfileInfo() {
  const [metaMaskAccount, address, can_edit_profile, getAddress] = useMetaMaskAccountStore(
    useShallow((state) => [
      state.metaMaskAccount,
      state.address,
      state.can_edit_profile,
      state.getAddress
    ])
  );

  const [openEditProfileDialog, setOpenEditProfileDialog] = useState(false);
  const [isSaveProfileResponseStatusOk, setIsSaveProfileResponseStatusOk] = useState<boolean | null>(null);
  
  const shortenAddress = (address: string) => {
    // display the first 9 characters of the address, then "..." then the last 3 characters
    const first = address.slice(0, 9);
    const last = address.slice(-3);
    return `${first}...${last}`;
  }

  const closeMessage = () => {
    setIsSaveProfileResponseStatusOk(null);
  }  

  return (
    <>
      <Stack alignItems={"center"} spacing={'20px'} sx={{bgcolor:'white', padding:'42px', borderRadius:'4px'}}>
        {address?.avatar_url && 
          <Avatar src={`${address.avatar_url}`} sx={{ width: 96, height: 96 }} />        
        }
        {!address?.avatar_url &&
          <Avatar sx={{ width: 96, height: 96, bgcolor: THEME_COLORS.get('blue'), fontSize:'3rem' }} >
            { address?.name == undefined ? null : address?.name[0]}
          </Avatar>
        }
        <h3 style={{fontSize:'1.125rem', fontWeight:'500', color: THEME_COLORS.get('black')}}>
          { address?.name == undefined ? 'unnamed' : address?.name}
        </h3>
        <h5 style={{fontSize:'0.875rem', color: THEME_COLORS.get('darkGray'), marginTop:'12px'}}>
          { address?.address && (shortenAddress(address.address))}
        </h5>
        <h4 style={{fontSize:'1rem', color: THEME_COLORS.get('darkGray'), fontWeight:'500'}}>
          { address?.about ? address?.about : ''}
        </h4>
        { can_edit_profile() && (
          <Button
              variant="outlined" sx={{ 'borderColor': THEME_COLORS.get('gray200'), 'borderRadius': '4px', color:THEME_COLORS.get('gray700'), textTransform: 'none' }}
              onClick={() => {setOpenEditProfileDialog(true)}}
          >
              Edit Profile
          </Button>
        )}
      </Stack>
      
      <EditProfileDialog
          open={openEditProfileDialog} 
          setOpen={setOpenEditProfileDialog}
          setIsSaveProfileResponseStatusOk={setIsSaveProfileResponseStatusOk}
        />

      {isSaveProfileResponseStatusOk === false &&
        <GraphMenuMessage 
          closeMessage={closeMessage}
          title={'Profile not edited'}
          message={'There was an error. Please try again.'}
        />
      } 
    </>
  )
}

export default ProfileInfo;