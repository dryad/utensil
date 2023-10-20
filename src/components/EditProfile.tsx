import React, { useRef, useEffect } from "react";
import useState from 'react-usestateref';
import {
    Container,
    Paper,
    Box,
    Button,
    Grid,
    TextField,
    Card,
    CardContent,
    Typography,
    ButtonGroup,
  } from "@mui/material";
import { Avatar as AvatarMaterial } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "libs/axios";
import Avatar from "react-avatar-edit";

function EditProfile() {
    const navigate = useNavigate();
    const [metaMaskAccount, setMetaMaskAccount] = useState(""); // The metamask account that is currently selected.
    const [address, setAddress] = useState({}); // The address object to display
    const [errorTextName, setErrorTextName] = useState(""); // The error text to display for the name field
    const [avatarPreview, setAvatarPreview] = useState(null);

    const onCloseAvatar = () => {
        setAvatarPreview(null);
    }
    const onCrop = (pv: any) => {
        setAvatarPreview(pv);
    }
    const onBeforeFileLoad = (elem: any) => {
        if (elem.target.files[0].size > 2000000) {
            alert("File is too big!");
            elem.target.value = "";
        }
    }

    const savePressed = async () => {
        console.log('savePressed');

        // axios post to /api/address/123 containing name and image file

        let editAddress = address;
        
        if (avatarPreview) {
            editAddress['avatar'] = avatarPreview;
        }
        

        const { data } = await axios.post(`/api/address/${address.address}/`, {editAddress});


        
        navigate('/profile/' + address.address);
    }
    async function getMetaMaskAccount() {
        if (typeof ethereum !== 'undefined') {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            console.log('set metaMaskAccount', account);
            setMetaMaskAccount(account);
            const { data } = await axios.get(`/api/address/${account}/`);
            setAddress(data);
            console.log('data', data);
            if (data.name == null ) {
                setErrorTextName("Please enter a name");
            }
        }
    };

    useEffect(() => {
        getMetaMaskAccount();
    }, []);
    return (
        <div className="Profile">
            <Container maxWidth="sm">
                <Paper elevation={3}>
                    <Box padding={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h5">
                                    Edit Profile
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                {address.address}
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6">
                                    Avatar
                                </Typography>
                                {/*  */}
                                <Avatar
                                    sx={{ display: 'inline' }}
                                    // width={200}
                                    height={200}
                                    onCrop={onCrop}
                                    onClose={onCloseAvatar}
                                    onBeforeFileLoad={onBeforeFileLoad}
                                    src={null}
                                    labelStyle={{ fontSize: '1rem' }}
                                  />
                                {avatarPreview && (
                                    <>
                                      <img src={avatarPreview} alt="Preview" />
                                    </>
                                  )}
                                {!avatarPreview && (
                                <AvatarMaterial src={`${address.avatar_url}`} sx={{'width': 100, 'height': 100}}/>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="standard-basic"
                                    label="Name"
                                    // variant="filled"
                                    fullWidth
                                    value={address.name || ''}
                                    error={errorTextName.length > 0}
                                    helperText={errorTextName}
                                    onChange={(e) => {
                                        if (e.target.value.length === 0) {
                                            setErrorTextName("Name is required");
                                        }
                                        else {
                                            setErrorTextName("");
                                            
                                        }
                                        setAddress({ ...address, name: e.target.value });
                                    }}

                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="standard-basic"
                                    label="About"
                                    // variant="filled"
                                    fullWidth
                                    multiline
                                    value={address.about || ''}
                                    error={errorTextName.length > 0}
                                    // helperText={errorTextName}
                                    onChange={(e) => {
                                        setAddress({ ...address, about: e.target.value });
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ButtonGroup
                                    variant="contained"
                                    color="primary"
                                    aria-label="contained primary button group"
                                >
                                    <Button
                                        disabled={errorTextName.length !== 0}
                                        onClick={() => {
                                            savePressed();
                                        }}
                                    >Save</Button>
                                    <Button 
                                        onClick={() => { navigate(-1); }}
                                    >
                                        Cancel
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>

            </Container>
        </div>
    );
}

export default EditProfile;