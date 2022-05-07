import * as React from "react";
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
    Avatar,
  } from "@mui/material";
import { useNavigate } from "react-router-dom";
function EditProfile() {
    const navigate = useNavigate();

    return (
        <div className="Profile">
            <Container maxWidth="sm">
                <Paper elevation={3}>
                    <Box padding={2}>
                    <Avatar src="/broken-image.jpg" />
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h5">
                                    Edit Profile
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField

                                    id="standard-basic"
                                    label="Name"
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ButtonGroup
                                    variant="contained"
                                    color="primary"
                                    aria-label="contained primary button group"
                                >
                                    <Button>Save</Button>
                                    <Button 
                                        onClick={() => { navigate(`/profile`); }}
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