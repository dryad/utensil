import React, { useState, useEffect, useRef } from "react";
import { Button, Dialog, TextField, Table, TableBody, TableRow } from "@mui/material";
import { DialogTitle, DialogContent, DialogActions } from "./Dialog";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SxProps } from "@mui/material";
import { Graph } from "models";
import GraphItem from "./GraphItem";

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
  handleGraphImport: Function;
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
  graphs,
  handleGraphImport
}) => {
  const [filteredGraphs, setFilteredGraphs] = useState([]);
  const [showGraphsList, setShowGraphsList] = useState(true);
  const okButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {setShowGraphsList(true)},[open])

  useEffect(() => {
    setNodeLabel(nodeLabel);

    if (nodeLabel && nodeLabel?.trim().length > 0) {
      const tempGraphs = graphs.filter((el: Graph) => {
        if (el.name.toLowerCase().trim().includes(nodeLabel.toLowerCase())) {
          return el
        }
      })
      setFilteredGraphs(tempGraphs);
    } else {
      setFilteredGraphs([]);
    }

  }, [nodeLabel]);

  const handleImportButton = (graphId: any) => {
    const canBeGraphReplaced = handleGraphImport(graphId); 
    console.log('canBeGraphReplaced', canBeGraphReplaced);

    if (canBeGraphReplaced) {
      onClose();
    } else {
      setShowGraphsList(false);
    }
  }
  
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
              if (e.key === 'Enter') { okButton.current?.click(); }
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
        {showGraphsList && (
          <DialogContent>
            <Table  aria-label="simple table">
              <TableBody>
                {filteredGraphs.map((graph: Graph) => (
                  <TableRow
                    key={graph.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <GraphItem graph={graph} handleImportButton={handleImportButton}/>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        )}
      </Dialog>
    </ThemeProvider>
  );
};

export default NodeDialog;
