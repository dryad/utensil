import React, { useState, useEffect, useRef } from "react";
import { Button, Dialog, TextField, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { DialogTitle, DialogContent, DialogActions } from "./Dialog";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SxProps } from "@mui/material";

const sx: SxProps = {
  "& .MuiDialog-container": {
    alignItems: "flex-start"
  }
};

type IDialogProps = {
  open: boolean;
  title?: string;
  nodeLabel?: string;
  onClose: Function;
  onOk: Function;
  setNodeLabel: Function;
  graphs: any;
};

const theme = createTheme({
  palette: {
      background: {
          default: "#ffffff"
        },
      primary: {
          main: "#1976d2",
          contrastText: "#8732f5",
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
});

const NodeDialog: React.FC<IDialogProps> = ({
  open,
  title,
  nodeLabel,
  onClose,
  onOk,
  setNodeLabel,
  graphs
}) => {
  const [filteredGraphs, setFilteredGraphs] = useState([]);

  const okButton = useRef(null);

  const matchFunction = (node: any) => {
    return node.label.toLowerCase().trim().includes(nodeLabel!.toLowerCase()) || node.name?.toLowerCase().trim().includes(nodeLabel!.toLowerCase())
  }

  useEffect(() => {
    setNodeLabel(nodeLabel);

    if (nodeLabel && nodeLabel?.trim().length > 0) {
      const tempGraphs = graphs.filter((el: any) => {
        console.log(JSON.parse(el.data).nodes)
        if (JSON.parse(el.data).nodes.some(matchFunction)) {
          return el
        }
      })
      setFilteredGraphs(tempGraphs);
    } else {
      setFilteredGraphs([]);
    }

  }, [nodeLabel]);

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        disableEnforceFocus
        fullWidth
        maxWidth="sm"
        aria-labelledby="customized-dialog-title"
        open={open}
        sx={sx}
        scroll="paper"
      >
        <DialogTitle id="customized-dialog-title" onClose={onClose}>
          {title}
        </DialogTitle>
        <DialogContent dividers sx={{'display': 'flex', 'justifyContent':'space-between', 'alignItems':'center', 'gap':'1rem', 'max-height': '7rem', 'min-height': '7rem'}}>
          <TextField
            autoFocus
            fullWidth
            id="label"
            label="Label"
            value={nodeLabel}
            variant="outlined"
            onKeyDown={e => {
              if (e.key === 'Enter') { okButton.current.click(); }
            }} 
            onChange={(e) => {
              setNodeLabel(e.target.value);
            }}
            onFocus={event => {
              event.target.select();
            }}
          />
          <DialogActions>
            <Button
              ref={okButton}
              variant="outlined"
              color="primary"
              onClick={onOk(nodeLabel)}
            >
              OK
            </Button>
          </DialogActions>
        </DialogContent>
        <DialogContent>
          <Table  aria-label="simple table">
            <TableBody>
              {filteredGraphs.map((graph) => (
                <TableRow
                  key={graph.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {graph.name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default NodeDialog;
