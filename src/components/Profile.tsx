import React, { useEffect, SyntheticEvent, ReactNode } from "react";
import useState from 'react-usestateref';
import {useParams, useNavigate} from "react-router-dom";
import axios from "libs/axios";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import {
    Container,
    Box,
    Button,
    Grid,
    Typography,
    Avatar,
    Stack,
    Tabs,
    Tab,
    Drawer,
    Tooltip    
  } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import "./Profile.css";
import { Graph } from "models";
import MetaMaskButton from "./MetaMaskButton";
import Utensil from "./Utensil";
import ShowPromptDialog from './ShowPromptDialog';
import ProfileGraphItem from './ProfileGraphItem';

interface TabPanelProps {
    children?: ReactNode;
    index: number;
    value: number;
}

type Address = {
    id: number;
    name: string;
    about: string;
    address: string;
    avatar_url: string;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}

function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

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
        h6: {
            color: "#fff",
        },
        h8: {
            color: "#BDB5B5",
        },

    },
});

const utensilTheme = createTheme({
    palette: {
        background: {
            default: "#ffffff"
          },
        primary: {
            main: "#1976d2",
            contrastText: "#fff",
        },
        secondary: {
            main: "#f44336",
            contrastText: "#fff",
        },
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
});

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .MuiDataGrid-cell': {
        color: 'rgba(255,255,255,0.85)',
        borderBottom: '#2d2d2d solid 1px !important',
        padding: '0',
    },
    '& .MuiDataGrid-columnHeader': {
        color: 'rgba(255,255,255,0.85)',
        fontSize: '0.8rem',
    },
    '& .MuiDataGrid-columnFooter': {
        color: 'rgba(255,255,255,0.85)',
        fontSize: '0.8rem',
    },
    '& .MuiTablePagination-toolbar': {
        color: 'rgba(255,255,255,0.5)',
    },
    '& .MuiTablePagination-selectIcon': {
        color: 'rgba(255,255,255,0.5)',
    },
    '& .Mui-disabled': {
        color: 'rgba(255,255,255,0.25)',
    },

    '& .MuiDataGrid-columnHeaders': {
        borderBottom: '1px solid rgba(255,255,255,0.15)',
    },

}));

function Profile() {
    let navigate = useNavigate();
    const { addressId } = useParams() // the addressId parameter from the URL
    const [publicGraphs, setPublicGraphs] = useState([]);
    const [privateGraphs, setPrivateGraphs] = useState([]);
    const [address, setAddress] = useState<Address>({}); // The address object to display
    const [metaMaskAccount, setMetaMaskAccount] = useState(""); // The metamask account that is currently selected.
    const [value, setValue] = useState(0);
    const [startNewConcept, setStartNewConcept] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);
    const [selectedGraph, setSelectedGraph] = useState<Graph | null | undefined>(null);

    const columns: GridColDef[] = [
        {
            field: 'data',
            headerName: 'Preview',
            renderCell: (params: GridRenderCellParams<string>) => {
                return (
                    <div 
                        style={{cursor: 'pointer'}} 
                        onClick={toggleDrawer(true, params.row)}
                    >
                        <ProfileGraphItem graphData={params.value}/>
                    </div>                    
                )
            },
            width: 100,
            editable: false,
            sortable: false,
        },
        {
            field: 'name',
            headerName: 'Name',
            renderCell: (params: GridRenderCellParams<string>) => {
                return (
                    <>
                        {params.value && params.value.length >= 50 && 
                            <Tooltip title={ <React.Fragment>
                                {params.value}
                            </React.Fragment>}>
                                <div 
                                    style={{padding: '12px', cursor: 'pointer'}} 
                                    onClick={toggleDrawer(true, params.row)}
                                >
                                    { params.value.slice(0, 50)} ...
                                </div>
                            </Tooltip>
                        }
                        {params.value && params.value.length < 50 && 
                            <div 
                                style={{padding: '12px', cursor: 'pointer'}} 
                                onClick={toggleDrawer(true, params.row)}
                            >
                                { params.value}
                            </div>
                        }
                    </>  
                )
            },
            width: 400,
            editable: false,
            sortable: false,
        },
        {
            field: 'note',
            headerName: 'Note',
            renderCell: (params: GridRenderCellParams<string>) => {
                return (
                    <>
                        {params.value && params.value.length >= 50 && 
                            <Tooltip title={ <React.Fragment>
                                {params.value}
                            </React.Fragment>}>
                                <div style={{padding: '12px'}}>
                                    { params.value.slice(0, 50)} ...
                                </div>
                            </Tooltip>
                        }
                        {params.value && params.value.length < 50 && 
                            <div style={{padding: '12px'}}>
                                { params.value}
                            </div>
                        }
                    </>                    
                )
            },
            flex: 1,
            editable: false,
            sortable: false,
        },
    ];
    
    useEffect(() => {
        getAddress();
        getMetaMaskAccount();
        refreshList();
    }, [startNewConcept, setStartNewConcept]);

    const toggleDrawer =
    (open: boolean, graph: Graph | null) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
       
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
              (event as React.KeyboardEvent).key === 'Shift')
          ) {
            return;
        }
        setSelectedGraph(graph);
        setStartNewConcept(open);
    };

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const refreshList = async () => {
        const { data: publicData } = await axios.get(`/api/graphs/public/`);
        setPublicGraphs(publicData);

        const { data: privateData } = await axios.get(`/api/graphs/private/?private=${addressId}`);
        setPrivateGraphs(privateData);
    };
    
    console.log('private graphs', privateGraphs)
    console.log('public graphs', publicGraphs)

    const getAddress = async () => {
        const { data } = await axios.get(`/api/address/${addressId}/`);
        setAddress(data);
    };

    const shortenAddress = (address: string) => {
        // display the first 6 characters of the address, then "..." then the last 4 characters
        const first = address.slice(0, 6);
        const last = address.slice(-4);
        return `${first}...${last}`;
    }

    const address_is_whitelisted = () => {
        return WhitelistedAddresses.includes(metaMaskAccount);
      }

    async function getMetaMaskAccount() {
        if (typeof ethereum !== 'undefined') {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            console.log('set metaMaskAccount', account);
            setMetaMaskAccount(account);
        }
    };

    const can_edit_profile = () => {
        return metaMaskAccount === address.address;
    }
    
    if (addressId === undefined) {
        return <div>No address provided</div>
    }
    else {
        return (
            <ThemeProvider theme={theme}>
                <Container maxWidth="xl">
                    <Grid
                        container
                        spacing={2}
                        textAlign="center"
                        style={{ borderBottom: '1px solid ##2d2d2d' }}
                        marginTop={1}
                        marginBottom={4}
                    >
                        <Grid item xs={2}>
                            <Typography variant="h6" onClick={() => navigate("/")} sx={{cursor: 'pointer'}}>
                                dryad
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>

                        </Grid>
                        <Grid item xs={2}>
                            <MetaMaskButton />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        spacing={2}
                        textAlign="center"
                    >
                        <Grid
                            item
                            xs={2}
                            style={{ border: '1px solid #2d2d2d', borderRadius: '10px' }}
                        >
                            <Stack alignItems={"center"} spacing={0.5}>
                                {address.avatar_url && 
                                    <Avatar src={`${address.avatar_url}`} sx={{ width: 100, height: 100 }} />
                                }
                                {!address.avatar_url &&
                                    <Avatar sx={{ width: 100, height: 100 }} />
                                }
                                <Typography variant="h6">
                                    { address.name == undefined ? 'unnamed' : address.name}
                                </Typography>
                                <Typography variant="h8">
                                    { address.address && (shortenAddress(address.address))}
                                </Typography>
                                <Typography variant="h8" sx={{'color': '#888', 'wordBreak': 'break-all', 'pt': 2, 'pb': 2}}>
                                    { address.about ? address.about : ''}
                                </Typography>
                                { can_edit_profile() && (
                                    <Button
                                        variant="outlined" sx={{ 'borderColor': '#2d2d2d', 'borderRadius': '10px' }}
                                        onClick={() => {
                                            navigate("/profile/edit");
                                        }}
                                    >
                                        Edit Profile
                                    </Button>
                                )}
                            </Stack>
                        </Grid>
                        <Grid item xs={10}>
                            <Stack direction="row" display="flex" justifyContent="space-between">
                                <Typography variant="h6">
                                    Concepts
                                </Typography>
                                { can_edit_profile() && (
                                    <Button variant="outlined" sx={{ 'borderColor': '#2d2d2d', 'borderRadius': '10px' }}
                                        onClick={toggleDrawer(true, null)}
                                    >
                                        Start new concept
                                    </Button>
                                )}    
                                <ThemeProvider theme={utensilTheme}>
                                    <Drawer
                                        anchor={"right"}
                                        open={startNewConcept}
                                        onClose={toggleDrawer(false, null)}
                                        hideBackdrop={true}
                                    >
                                        <div style={{
                                            width: '84vw', 
                                            padding: '2rem',
                                            backgroundColor: '#211f24', 
                                            height: '100vh'}}
                                        >
                                            <Utensil startNewConcept={true} setStartNewConcept={setStartNewConcept} selectedGraph={selectedGraph}/>
                                        </div>  
                                    </Drawer>
                                </ThemeProvider>                            
                            </Stack>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="Public" {...a11yProps(0)} sx={{color: 'gray'}}  />
                                    <Tab label="Private" {...a11yProps(1)} sx={{color: 'gray'}} onClick={() => !can_edit_profile() && setShowPrompt(true)}/>
                                </Tabs>
                            </Box>
                            {publicGraphs && (
                                <TabPanel value={value} index={0}>
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
                                            rows={publicGraphs}
                                            columns={columns}
                                            pageSize={25}
                                            rowsPerPageOptions={[25, 50, 100]}
                                            disableSelectionOnClick
                                            headerHeight={32}
                                            rowHeight={100}
                                        />
                                    </div>
                                </TabPanel>
                            )}
                            { can_edit_profile() && privateGraphs && (
                                <TabPanel value={value} index={1}>
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
                                            rows={privateGraphs}
                                            columns={columns}
                                            pageSize={25}
                                            rowsPerPageOptions={[25, 50, 100]}
                                            disableSelectionOnClick
                                            headerHeight={32}
                                            rowHeight={100}
                                        />
                                    </div>
                                </TabPanel>
                            )}
                            { !can_edit_profile() && (
                                <TabPanel value={value} index={1}>
                                    <div style={{ height: '1000px', width: '100%' }}>
                                        
                                    </div>
                                </TabPanel>
                            )}
                            <ShowPromptDialog 
                                showPrompt={showPrompt} 
                                setShowPrompt={setShowPrompt} 
                            >
                            </ShowPromptDialog>
                        </Grid>
                    </Grid>

                </Container>
            </ThemeProvider>
        );
    }
}

export default Profile;