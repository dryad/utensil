import React, { useRef, useEffect } from "react";
import useState from 'react-usestateref';
import axios from "libs/axios";
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
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import "./Profile.css";

const theme = createTheme({
    typography: {
        fontFamily: 'Calibre,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',

        h6: {
            color: "#fff",
        },
        h8: {
            color: "#ddd",
        },
    },
});

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .MuiDataGrid-cell': {
        color: 'rgba(255,255,255,0.65)',
      },
}));

const columns: GridColDef[] = [
    {
        field: 'name',
        headerName: 'Name',
        width: 150,
        editable: false,
    },
];

function Profile() {
    const [graphs, setGraphs] = useState<Graph[]>([]); // The list of graphs
    const refreshList = async () => {
        const { data } = await axios.get(`/api/graphs/`);
        setGraphs(data);
    };

    useEffect(() => {
        refreshList();
        // getMetaMaskAccount();
      }, []);
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
                <Grid
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
                        <div style={{ height: '1000px', width: '100%' }}>
                            <StyledDataGrid
                                sx={{
                                    '.MuiDataGrid-columnSeparator': {
                                        display: 'none',
                                    },
                                    // '&.MuiDataGrid-root': {
                                    //   border: 'none',
                                    // },
                                }}
                                rows={graphs}
                                columns={columns}
                                pageSize={25}
                                rowsPerPageOptions={[25, 50, 100]}
                                disableSelectionOnClick
                                // headerHeight={0}
                                hideFooter={true}
                            />
                        </div>
                    </Grid>
                </Grid>

            </Container>
        </ThemeProvider>
    );
}

export default Profile;