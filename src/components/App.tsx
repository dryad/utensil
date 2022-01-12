import _ from "lodash";
import React, { useRef, useEffect } from "react";
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
} from "@mui/material";

import { Graph } from "models";
import axios from "libs/axios";
import VisCustomNetwork from "libs/vis-custom-network";
import VisNetwork from "./VisNetwork";
import GraphList from "./GraphList";
import NetworkButtons from "./NetworkButtons";
import useState from 'react-usestateref';
function App() {
  const networkRef = useRef<VisCustomNetwork | null>(null);

  const [graphs, setGraphs] = useState<Graph[]>([]);
  const [graph, setGraph] = useState<Graph | null>(null);
  const [graphName, setGraphName] = useState("");
  const [graphNote, setGraphNote] = useState("");
  const [historyListBack, setHistoryListBack, historyListBackRef] = useState([]);
  const [historyListForward, setHistoryListForward, historyListForwardRef] = useState([]);

  function undo_timer() {
  // useEffect(() => {
    console.log('Undo timer started with new graph');
    let repeat: any;
    async function detectChange() {
      // console.log('Undo timer fired');

      const newHistory : string = stringifyGraph();
      const lastHistory : string = historyListBackRef.current[0];
      // console.log(newHistory == lastHistory);
      // console.log(newHistory, lastHistory);
      if (newHistory !== lastHistory) {
        async function processHistory() {
          console.log('Undo timer fired with new graph');
          //check if newHistory is the same as any element of historyListBack or historyListForward
          //then we can assume that the user has performed an undo/redo
          console.log('this is what im evaluating', newHistory);
          console.log('this is what i think the history back list is now', historyListBackRef.current);
          const newHistoryIndexBack = historyListBackRef.current.indexOf(newHistory);
          const newHistoryIndexForward = historyListForwardRef.current.indexOf(newHistory);
        
          const undo_redo_performed : boolean = (newHistoryIndexBack !== -1 || newHistoryIndexForward !== -1);
          console.log('Indexes: ', newHistoryIndexBack, newHistoryIndexForward);
          //if it is neither in historyListBack nor historyListForward, then we can assume that the user has performed a new change
          if (undo_redo_performed) {
            console.log('This was an undo/redo, so we are NOT clearing historyListFoward');

          }
          else {
            console.log('This was not an undo/redo, so we ARE clearing historyListForward');
            setHistoryListForward([]); 
          }
        }
        await processHistory();
        console.log('Undo timer is saving new graph to setHistoryListBack')
        setHistoryListBack((state) => [newHistory, ...state]);         
      }


      repeat = setTimeout(detectChange, 1000);
    }
    detectChange();
    return () => {
      if (repeat) {
          clearTimeout(repeat);
      }
    }

  // }, [graph]);
  }

  useEffect(() => {
    console.log('new historyListBack', historyListBack);
  }, [historyListBack]);

  useEffect(() => {
    console.log('new historyListForward', historyListForward);
  }, [historyListForward]);

  const refreshList = async () => {
    const { data } = await axios.get("/api/graphs/");
    setGraphs(data);
  };

  const loadGraphFromString = (graph: string) => { // used by Undo/Redo. 
    if (graph !== null) {
     
      //load json into graph instance
      const newGraph : Graph = JSON.parse(graph);

      setGraph(newGraph);
      networkRef.current?.setData(newGraph);
    }
  };

  const handleGraphSelected = (id: any) => {
    const graph = graphs?.find((g: any) => g.id === id);
    if (graph !== null) {
      setGraph(graph);
      const data = JSON.parse(graph?.data);
      networkRef.current?.setData(data);
    }
  };

  const handleGraphDelete = async (id: any) => {
    await axios.delete(`/api/graphs/${id}/`);
    await refreshList();
  };


  const onUndo = () => {
    console.log('onUndo');

    if (historyListBack.length > 1) {
      const newHistoryForward : string = stringifyGraph();

      //previousGraph is second element in historyListBack
      const previousGraph : string = historyListBack[1];
      //remove first element with setHistoryListBack
      
      console.log('onUndo is removing first element of historyListBack');
      setHistoryListBack((state) => state.slice(1));
      loadGraphFromString(previousGraph);
      
      //save current graph to newHistoryForward
      console.log('onUndo is saving current graph to newHistoryForward');
      setHistoryListForward((state) => [newHistoryForward, ...state]); 
    }

  }
  
  const onRedo = () => {
    console.log('onRedo');
    if (historyListForward.length > 0) {
      
      //load graph from first element of historyListForward
      const nextGraph : string = historyListForward[0];
      
      //remove graph from historyListForward
      console.log('onRedo is removing first element of historyListForward');
      setHistoryListForward((state) => state.slice(1));

      //save nextGraph to historyListBack with setHistoryListBack
      console.log('onRedo is saving nextGraph to historyListBack');
      setHistoryListBack((state) => [nextGraph, ...state]);
      loadGraphFromString(nextGraph);
    }

  }
  
  const onButton = (nextView: string) => {
      console.log('onButton fired', nextView);
      switch(nextView) {
        case "pan":
          networkRef.current?.network.disableEditMode();
          break;
        case "node":
          networkRef.current?.network.addNodeMode();
          break;
        case "directed-edge":
          networkRef.current?.network.addEdgeMode();
          break;
        case "edge":
          break;
      }
      
  };

  const addNodeComplete = () => {
    networkRef.current?.network.addNodeMode(); // Makes adding nodes continual
  }

  const addEdgeComplete = () => {
    networkRef.current?.network.addEdgeMode(); // Makes adding edges continual
  }

  const stringifyGraph = () => { //used in both handeSave and addHistoryBack
    const edges = networkRef.current?.edges.get();
    const nodes = networkRef.current?.nodes.get();
    const positions = networkRef.current?.network.getPositions();

    for (const node of nodes) {
      node.x = positions[node.id].x;
      node.y = positions[node.id].y;
    }
    return JSON.stringify({ edges, nodes });
  
  };

  const handleSave = async () => {
    // const clone = _.cloneDeepWith(networkRef.current?.network, (x: any) => {
    //   return x;
    // });
    // const edges = clone.body.data.edges.get();
    // const nodes = clone.body.data.nodes.get();
    const data = stringifyGraph();
    await axios.post("/api/graphs/", {
      name: graphName,
      note: graphNote,
      data: data,
    });

    await refreshList();
  };

  useEffect(() => {
    refreshList();
    undo_timer();
  }, []);
  
  return (
    <Container>
      <Grid container spacing={0}>
        <Grid item>
          <Paper>
            <NetworkButtons 
              networkRef={networkRef}
              onButton={onButton}
              undoDisabled={historyListBack.length <= 1}
              redoDisabled={historyListForward.length === 0}
              onUndo={onUndo}
              onRedo={onRedo}
            />
          </Paper>
        </Grid>
        <Grid item xs={7}>
          <Paper>
            <VisNetwork 
              networkRef={networkRef}
              
              addNodeComplete={addNodeComplete}
              addEdgeComplete={addEdgeComplete}
              historyListBack={historyListBack}
              historyListForward={historyListForward}
              historyListBackRef={historyListBackRef}
              stringifyGraph={stringifyGraph}
            />
            <Box m={1}>
              <TextField
                id="outlined-basic"
                label="Graph Name"
                variant="outlined"
                size="small"
                value={graphName}
                onChange={(e: any) => setGraphName(e.target.value)}
                fullWidth
              />
            </Box>
            <Box m={1}>
              <TextField
                id="outlined-basic"
                label="Note"
                multiline
                rows={4}
                variant="outlined"
                size="small"
                value={graphNote}
                onChange={(e: any) => setGraphNote(e.target.value)}
                fullWidth
              />
            </Box>
            <Box>
              <Button variant="outlined" color="primary" onClick={handleSave}>
                Save
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <GraphList
            graphs={graphs}
            onGraphSelected={handleGraphSelected}
            onGraphDelete={handleGraphDelete}
          />
          {graph && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" component="h2">
                  Note
                </Typography>
                <Typography variant="body2" component="p">
                  {graph.note}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
