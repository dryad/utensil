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
    palette: {
        background: {
            default: "#ffffff"
          },
        primary: {
            main: "#ffffff",
            contrastText: "#fff",
        },
        secondary: {
            main: "#f44336",
            contrastText: "#fff",
        },
        error: {
            main: "#f44336",
            contrastText: "#fff",
        },
        warning: {
            main: "#ff9800",
        },
        info: {
            main: "#2196f3",
            contrastText: "#fff",
        },
        success: {
            main: "#4caf50",
            contrastText: "#fff",
        },
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },

    typography: {
        fontFamily: 'Calibre,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
        // fontFamily: 'Montserrat',
        h6: {
            color: "#fff",
        },
        h8: {
            color: "#BDB5B5",
        },

    },
});

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .MuiDataGrid-cell': {
        color: 'rgba(255,255,255,0.85)',
        borderBottom: '#2d2d2d solid 1px !important',
      },
    '& .MuiDataGrid-columnHeader': {
        color: 'rgba(255,255,255,0.85)',
        fontSize: '0.8rem',
    },
    '& .MuiDataGrid-columnFooter': {
        color: 'rgba(255,255,255,0.85)',
        fontSize: '0.8rem',
    },

    '& .MuiDataGrid-columnHeaders': {
        borderBottom: '1px solid rgba(255,255,255,0.15)',
    },

}));

const columns: GridColDef[] = [
    {
        field: 'name',
        headerName: 'Name',
        width: 500,
        editable: false,
        sortable: false,
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
            <Container maxWidth="xl">
                <Grid
                    container
                    spacing={2}
                    align="center"
                    style={{ borderBottom: '1px solid ##2d2d2d' }}
                    marginTop={1}
                    marginBottom={4}
                >
                    <Grid item xs={2}>
                        <Typography variant="h6">
                            dryad
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>

                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" sx={{'borderColor': '#2d2d2d', 'borderRadius': '10px', 'marginRight': '0%', float: "right"}}>Connect wallet</Button>
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={2}
                    align="center"
                >
                    <Grid
                        item
                        xs={2}
                        style={{ border: '1px solid #2d2d2d', borderRadius: '10px' }}
                    >
                        <Stack alignItems={"center"} spacing={0.5}>
                            <Avatar src="/broken-image.jpg" sx={{ width: 80, height: 80 }} />
                            <Typography variant="h6">
                                user
                            </Typography>
                            <Typography variant="h8">
                                0x0000...0000
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={10}>
                        <Stack direction="row" display="flex" justifyContent="space-between">
                            <Typography variant="h6">
                                Concepts
                            </Typography>
                            <Button variant="outlined" sx={{'borderColor': '#2d2d2d', 'borderRadius': '10px'}}>Start new concept</Button>
                        </Stack>
                        <div style={{ height: '1000px', width: '100%' }}>
                            <StyledDataGrid
                                sx={{
                                    '.MuiDataGrid-columnSeparator': {
                                        display: 'none',
                                    },
                                    '&.MuiDataGrid-root': {
                                      border: '1px solid #2d2d2d',
                                      borderRadius: '10px',
                                      marginTop: '20px',
                                    },
                                }}
                                rows={graphs}
                                columns={columns}
                                pageSize={25}
                                rowsPerPageOptions={[25, 50, 100]}
                                disableSelectionOnClick
                                headerHeight={32}
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