import {useState, useEffect, Dispatch, SetStateAction, useRef } from 'react';
import { DialogTitle, DialogActions, DialogWindow, InputField, DialogButton } from ".";
import { styled } from '@mui/styles';
import { THEME_COLORS } from 'constants/colors';
import { useShallow } from 'zustand/react/shallow'
import { useMetaMaskAccountStore } from "store/MetaMaskAccountStore";
import Avatar from "react-avatar-edit";
import { Avatar as AvatarMaterial } from "@mui/material";
import { saveProfileToDB } from 'components/networkFunctions';
import { DeleteIcon, EditIcon } from 'assets/icons/svg';

interface DialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setIsSaveProfileResponseStatusOk: Dispatch<SetStateAction<boolean | null>>;
}

const RemoveImgButton = styled('div')(() => ({
  display:'flex', 
  alignItems:'center', 
  gap:'6px', 
  position: 'relative', 
  top:'20px', 
  right: '215px', 
  zIndex:'20', 
  fontSize: '0.875rem', 
  cursor:'pointer'
}));

const EditProfileDialog = (props: DialogProps) => {
  const { open, setOpen, setIsSaveProfileResponseStatusOk } = props;
 
  const [metaMaskAccount, address, getMetaMaskAccount, getAddress] = useMetaMaskAccountStore(
    useShallow((state) => [
      state.metaMaskAccount,
      state.address,
      state.getMetaMaskAccount,
      state.getAddress
    ])
  );

  useEffect(() => {
    getMetaMaskAccount();
    getAddress(metaMaskAccount);
  }, []);  

  const [name, setName] = useState(address?.name);
  const [about, setAbout] =useState(address?.about);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isDeletedAvatar, setIsDeletedAvatar] = useState(false);
  const [error, setError] = useState(false);
  const removeBtnRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (address?.name !== undefined) {
      setName(address?.name);      
    }  
    if (address?.about !== undefined) {
      setAbout(address?.about);     
    }  
  },[address?.name, address?.about]);
  
  useEffect(() => {
    if (name !== "")  {
      setError(false);
    } 
  }, [name]);
  
  const onCloseAvatar = () => {
    removeBtnRef.current.style.zIndex = '20';
  }
  const onCrop = (pv: any) => {
    setAvatarPreview(pv);
    removeBtnRef.current.style.zIndex = '-10';
    setIsDeletedAvatar(false);
  }
  const onBeforeFileLoad = (elem: any) => {
    if (elem.target.files[0].size > 2000000) {
        alert("File is too big!");
        elem.target.value = "";
    }
  }

  const saveChanges = async () => {
    let editAddress = {
      ...address,
      name: name,
      about: about
    };
    
    if (avatarPreview) {
        editAddress['avatar'] = avatarPreview;
    } 
    
    if (isDeletedAvatar) {
      editAddress['avatar'] = '';
    }

    await saveProfileToDB(address!.address!, editAddress, setIsSaveProfileResponseStatusOk);
    getAddress(metaMaskAccount);  
}

  return (
    <DialogWindow
      open={open}
      onClose={() => {setOpen(false); setAvatarPreview(null)}}
      aria-labelledby="edit-profile-dialog"
      width={'420px'}
    >
      <DialogTitle 
        id="edit-profile-dialog" 
        onClose={() => setOpen(false)}
      >
        Edit Profile 
      </DialogTitle>
      <div style={{display:'flex', gap:'16px', alignItems:"center", margin:'-20px 0'}}>
        <div>
          {avatarPreview && !isDeletedAvatar && (
            <img src={avatarPreview} alt="Preview" width={'96px'} height={'96px'}/>
          )}
          {!avatarPreview && !isDeletedAvatar && address?.avatar_url &&(
            <AvatarMaterial src={`${address?.avatar_url}`} sx={{'width': 96, 'height': 96}}/>
          )}
          {(isDeletedAvatar || (!avatarPreview && !address?.avatar_url)) &&
            <AvatarMaterial sx={{ width: 96, height: 96, bgcolor: THEME_COLORS.get('blue'), fontSize:'3rem' }} >
              { name == undefined ? null : name[0]}
            </AvatarMaterial>
          }
        </div>
        <Avatar
          width={200}
          height={200}
          onCrop={onCrop}
          onClose={onCloseAvatar}
          onBeforeFileLoad={onBeforeFileLoad}
          src={null}
          borderStyle={{border: 'none'}}
          labelStyle={{ fontSize: '0.875rem', fontWeight:'500', color: THEME_COLORS.get('gray600') }}
          label={
            <div style={{display:'flex',alignItems:'center', gap:'6px', position: 'relative', bottom: '16px'}}>
              <EditIcon />
              Choose a file
            </div>}
        />
        <RemoveImgButton
          ref={removeBtnRef}
          onClick={() => {setIsDeletedAvatar(true); setAvatarPreview(null)}}
          style={{
            'color': !isDeletedAvatar && (avatarPreview || address?.avatar_url) ?
            THEME_COLORS.get('gray600') : 'white'
          }}
        >
          <DeleteIcon />
          Remove
        </RemoveImgButton>
      </div>
      <div>
        <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
          <div style={{fontSize:"0.9375rem", fontWeight:'500', color: "#191919"}}>
            Name
          </div>
          <InputField
            id="outlined-basic"
            variant="outlined"
            defaultValue={address?.name}
            value={name}
            placeholder='Enter name'
            error={error}
            helperText={error ? "Name required" : " "} 
            onKeyDown={(e) => {e.stopPropagation()}}
            onChange={(e: any) => {
              setName(e.target.value);
              if (name === "") {
                setError(true);
              }
            }}          
          />
        </div>
        
        <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
          <div style={{fontSize:"0.9375rem", fontWeight:'500', color: "#191919"}}>
            About
          </div>
          <InputField
            id="outlined-basic"
            variant="outlined"
            placeholder='Add note'
            defaultValue={address?.about}
            value={about}
            onKeyDown={(e) => {e.stopPropagation()}}
            onChange={(e: any) => setAbout(e.target.value)}
          />
        </div>        
      </div>
      
      <DialogActions>
        <DialogButton
          variant="outlined"
          sx={{color: THEME_COLORS.get('gray700'), background: THEME_COLORS.get('white'), border: '1px solid #e5e7eb'}}
          onClick={() => {
            setName(address?.name);
            setAbout(address?.about);
            setError(false);
            setOpen(false); 
            setAvatarPreview(null);
            setIsDeletedAvatar(false);
          }}
        >
          Cancel
        </DialogButton>
        <DialogButton
          variant="contained"
          sx={{background: THEME_COLORS.get('blue')}}
          onClick={() => {
            if (name === "")  {
              setError(true);
            } else {
              saveChanges();
              setOpen(false);
            }
          }}
        >
          Save Changes
        </DialogButton>
      </DialogActions>
    </DialogWindow>
  );
};

export default EditProfileDialog;