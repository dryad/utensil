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
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

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

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'firstName',
        headerName: 'First name',
        width: 150,
        editable: true,
    },
    {
        field: 'lastName',
        headerName: 'Last name',
        width: 150,
        editable: true,
    },
    {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 110,
        editable: true,
    },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params: GridValueGetterParams) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
];
const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

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
                        <div style={{ height: 400, width: '100%' }}>
                          <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection
                            disableSelectionOnClick
                          />
                        </div>
                    </Grid>
                </Grid>

            </Container>
        </ThemeProvider>
    );
}

export default Profile;