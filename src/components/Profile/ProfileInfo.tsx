import { Avatar, Button, Stack } from '@mui/material';
import { useMetaMaskAccountStore } from "store/MetaMaskAccountStore";
import { useShallow } from "zustand/react/shallow";
import { THEME_COLORS } from "constants/colors";
import { useState } from 'react';
import GraphMenuMessage from '../GraphMenuMessage';
import EditProfileDialog from "components/Dialog/EditProfileDialog";

function ProfileInfo() {
  const [address, avatar, can_edit_profile] = useMetaMaskAccountStore(
    useShallow((state) => [
      state.address,
      state.avatar,
      state.can_edit_profile,
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
        {avatar?.avatar_url && 
          <Avatar src={`${avatar.avatar_url}`} sx={{ width: 96, height: 96 }} />        
        }
        {!avatar?.avatar_url &&
          <Avatar sx={{ width: 96, height: 96, bgcolor: THEME_COLORS.get('blue'), fontSize:'3rem' }} >
            { avatar?.name == undefined ? null : avatar?.name[0]}
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