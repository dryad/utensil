import * as React from "react";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
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
    Stack,
  } from "@mui/material";
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const theme = createTheme({
    typography: {
        fontFamily: 'Calibre,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',

        h6: {
          color: "#fff",
        },
        h8: {
            color: "#ddd",
          }
      }
  });

function Profile() {
    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg">
                <Grid
                    container
                    spacing={2}
                    align="center"
                    style={{ borderBottom: '1px solid #444' }}
                    marginTop={1}
                    marginBottom={4}
                >
                    <Grid item xs={4}>
                        <Typography variant="h6">
                            dryad
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>

                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="outlined">Connect wallet</Button>
                    </Grid>
                </Grid>
                <Grid // Body

                    container
                    spacing={2}
                    align="center"

                >
                    <Grid
                        item
                        xs={4}
                        style={{ border: '1px solid #444', borderRadius: '10px' }}
                    >
                        <Stack alignItems={"center"}>
                            <Avatar src="/broken-image.jpg" sx={{ width: 80, height: 80 }} />
                            <Typography variant="h6">
                                dryad
                            </Typography>
                            <Typography variant="h8">
                                0x0000...0000
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={8}>
                        <Stack direction="row" display="flex" justifyContent="space-between">
                            <Typography variant="h6">
                                Thoughtforms
                            </Typography>
                            <Button variant="outlined">Start new concept</Button>
                        </Stack>
                        <Grid
                            item
                            style={{ border: '1px solid #444', borderRadius: '10px' }}
                        >
                            Graph name
                        </Grid>
                    </Grid>
                </Grid>

            </Container>
        </ThemeProvider>
    );
}

export default Profile;