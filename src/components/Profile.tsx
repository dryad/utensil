import React, { useRef, useEffect, SyntheticEvent, ReactNode } from "react";
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
    Tabs,
    Tab
  } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import "./Profile.css";
import {useParams, useNavigate} from "react-router-dom";
import MetaMaskButton from "./MetaMaskButton";

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
    let navigate = useNavigate();
    const { addressId } = useParams() // the addressId parameter from the URL
    const [graphs, setGraphs] = useState([]); // The list of graphs
    const [address, setAddress] = useState<Address>({}); // The address object to display
    const [metaMaskAccount, setMetaMaskAccount] = useState(""); // The metamask account that is currently selected.
    const [value, setValue] = useState(0);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const refreshList = async () => {
        const { data } = await axios.get(`/api/graphs/`);
        setGraphs(data);
    };
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

    useEffect(() => {
        refreshList();
        getAddress();
        getMetaMaskAccount();
    }, []);
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
                        align="center"
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
                        align="center"
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
                                        
                                        // color="primary"
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
                                <Button variant="outlined" sx={{ 'borderColor': '#2d2d2d', 'borderRadius': '10px' }}>Start new concept</Button>
                            </Stack>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="Public" {...a11yProps(0)} sx={{color: 'gray'}}  />
                                    <Tab label="Private" {...a11yProps(1)} sx={{color: 'gray'}} />
                                </Tabs>
                            </Box>
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
                                        rows={graphs}
                                        columns={columns}
                                        pageSize={25}
                                        rowsPerPageOptions={[25, 50, 100]}
                                        disableSelectionOnClick
                                        headerHeight={32}
                                        hideFooter={true}
                                    />
                                </div>
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <Box sx={{color: '#fff', pt: 2}}>
                                    Private concepts
                                </Box>
                            </TabPanel>
                        </Grid>
                    </Grid>

                </Container>
            </ThemeProvider>
        );
    }
}

export default Profile;