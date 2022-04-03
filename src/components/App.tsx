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
  ButtonGroup,
} from "@mui/material";

import { Graph } from "models";
import axios from "libs/axios";
import VisCustomNetwork from "libs/vis-custom-network";
import VisNetwork from "./VisNetwork";
import GraphList from "./GraphList";
import NetworkButtons from "./NetworkButtons";
import useState from 'react-usestateref';
import ConfirmDialog from "./ConfirmDialog";
import TreeList from "./TreeList";
import { Tree } from "models";
import MetaMaskButton from "./MetaMaskButton";

function App() {
  const UNDO_STEPS_LIMIT = 250;

  const networkRef = useRef<VisCustomNetwork | null>(null);

  const [graphs, setGraphs] = useState<Graph[]>([]);
  const [graph, setGraph] = useState<Graph | null>(null);
  const [graphToLoad, setGraphToLoad] = useState<Graph | null>(null);
  const [graphName, setGraphName] = useState("");
  const [graphNote, setGraphNote] = useState("");
  const [historyListBack, setHistoryListBack, historyListBackRef] = useState([]);
  const [historyListForward, setHistoryListForward, historyListForwardRef] = useState([]);
  const [isUserDragging, setIsUserDragging, isUserDraggingRef] = useState(false);
  const [buttonMode, setButtonMode, buttonModeRef] = useState('pan');
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteMode, setDeleteMode, deleteModeRef] = useState(false);
  const [addEdgeType, setAddEdgeType, addEdgeTypeRef] = useState("directed");
  const [trees, setTrees] = useState<Tree[]>([]);
  const [confirmGraphLoadOpen, setConfirmGraphLoadOpen] = useState(false);
  const [metaMaskAccount, setMetaMaskAccount] = useState("");
  const clearSearch = () => {
    setSearchQuery('');
  }

  function initializeUndoTimer() {
    console.log('Undo timer started with new graph');
    let repeat: any;
    async function detectChange() {
      if (!isUserDraggingRef.current) {
        let newHistory : string = stringifyGraph();
        let newHistoryObject = JSON.parse(newHistory);
        let lastHistory : string = historyListBackRef.current[0];
        
        //remove isUndoStep field from lastHistory JSON string, because for the first comparison we just want to see if the graph has changed.
        if (lastHistory) {
          let lastHistoryObject = JSON.parse(lastHistory);
          delete lastHistoryObject.isUndoStep;
          lastHistory = JSON.stringify(lastHistoryObject);
        }

        if (newHistory !== lastHistory) { // the graph has changed on this timer update.
          async function processHistory() {
            //if newHistory is an undo step, we want to maintain historyListForward. If it is a brand new step, we want to clear historyListForward.
            if (!JSON.parse(newHistory).isUndoStep) {
              setHistoryListForward([]); 
            }
          }
          await processHistory();
          let newHistoryObject = JSON.parse(newHistory);
          newHistoryObject.isUndoStep = true; // this is where we classify graph history as an undo step, for above comparison.
          setHistoryListBack((state) => [JSON.stringify(newHistoryObject), ...state.slice(0, UNDO_STEPS_LIMIT - 1)]); // appends new undo step, but only keeps the last X steps.
        }
      }
      repeat = setTimeout(detectChange, 500);
    }
    detectChange();
    return () => {
      if (repeat) {
          clearTimeout(repeat);
      }
    }
  }

  useEffect(() => {
    console.log('new historyListBack', historyListBack);
    treeTraversal(); // run treeTraversal every time an Undo step is added.
  }, [historyListBack]);

  useEffect(() => {
    // console.log('new historyListForward', historyListForward);
  }, [historyListForward]);

  useEffect(() => {
    refreshList(); // when the text of the search query changes, we want to refresh the list of graphs.
  }, [searchQuery]);

  useEffect(() => {
    console.log('Switching to buttonMode: ', buttonMode); // when the text of the search query changes, we want to refresh the list of graphs.
  }, [buttonMode]);

  const refreshList = async () => {
    const { data } = await axios.get(`/api/graphs/?q=${searchQuery}`);
    setGraphs(data);
  };

const treeTraversal = async () => {

  let treeText = "";
  let nodes = networkRef.current?.nodes.get(); // get all nodes from the network.
  const edges = networkRef.current?.edges.get(); // get all edges from the network.
  const positions = networkRef.current?.network.getPositions();

  const to_traverse = [];
  const id_to_edge = {};
  const id_to_node = {};

  // gather nodes and skip labelNodes
  for (const node of nodes) {
    if (node.isLabelNode != true) {
      to_traverse.push(node);
      id_to_node[node.id] = node;

      for (const edge of edges) {
        if (node.id == edge.to) {
          id_to_edge[node.id] = edge;
        }
      }
    }
  };

  //this sort is strictly for convenience in analyzing console data
  to_traverse.sort((a, b) => {
    return b.level - a.level;
  });

  function getLeftChild(node) {
    return id_to_node[id_to_edge[node.id].from];
  }
  function getRightChild(node) {
    return id_to_node[id_to_edge[node.id].eventual];
  }

  // this algorithm is well known 
  function inOrderTraversal(currentNode, treeList) {
    if (currentNode.level > 0) {
      treeList = inOrderTraversal(getLeftChild(currentNode), treeList);
      treeList.push(currentNode);
      treeList = inOrderTraversal(getRightChild(currentNode), treeList);
    }
    else {
      treeList.push(currentNode);
    }
    return treeList
  };

  //selects the highest edge that has not yet been parsed
  function getStartNode(traversedSet) {
    let difference = new Set(
      [...toTraverseSet].filter(x => !traversedSet.has(x))
    );
    let tmp = Array.from(difference);
    tmp.sort((a, b) => {
      return b.level - a.level;
    });
    return tmp[0];
  };

  const toTraverseSet = new Set(to_traverse);
  // if (false) {
  var parseList = [];
  if (to_traverse.length > 0) {
    var traversedSet = new Set();

    for (let i = 0; i < to_traverse.length; i++) { // avoid while loop
      var treeList = [];
      const startNode = getStartNode(traversedSet);

      const res = inOrderTraversal(startNode, treeList);
      parseList.push({ 'nodes': res });
      res.forEach(item => traversedSet.add(item))

      if (traversedSet.size == to_traverse.length) {
        break
      };
      // console.log('i', i+1); // the number of roots / highest edges
    }
  };

  console.log('result', parseList) ;
  setTrees(parseList);
  };


  const loadGraphFromString = (graph: string) => { // used by Undo/Redo. 
    if (graph !== null) {
     
      //load json into graph instance
      const newGraph : Graph = JSON.parse(graph);

      setGraph(newGraph);
      networkRef.current?.setData(newGraph);
      
      onButton(buttonMode); // 'buttonMode' is a React state string of which button is selected.
                            // After a graph is loaded via Undo/Redo, vis-network will be in pan mode. The UI buttons will stay in the same mode (ie, add node, add edge, etc)
                            // If a different button was selected, we put vis into that mode by sending the selected button string to the onButton function.
      
      if (newGraph.viewPosition) { // loaded graphs from database might not have a viewPosition property.
        //move vis-network to the viewport position of the loaded graph.
        networkRef.current?.network.moveTo({
          position: { x: newGraph.viewPosition.x, y: newGraph.viewPosition.y },
          scale: 1,
          animation: false,
        });
      }
    }
  };

  const confirmReplaceGraph = () => {
      const graph = graphToLoad; // graphToLoad is a React state string of the graph to be loaded. It is set before the confirm box is opened.
      setGraph(graph);
      setGraphName(graph.name);
      setGraphNote(graph.note);
      const data = JSON.parse(graph?.data);
      networkRef.current?.setData(data);
        
      //clear Undo/Redo history
      // setHistoryListBack([]); // no longer clearing Undo steps on graph load. 
      setHistoryListForward([]);

      //Set button to pan mode when loading a new graph. Vis-network state will be in pan mode, so we want the button to show the pan tool.
      onButton('pan');
  }

  const canImportGraph = () =>{
    const existingGraph = JSON.parse(stringifyGraph());
    return existingGraph.nodes && existingGraph.nodes.length > 0 ? true : false;
  }

  function mergeGraphs(graph1: Graph, graph2: Graph) {
    const newNodes = [...graph1.nodes, ...graph2.nodes];
    const newEdges = [...graph1.edges, ...graph2.edges];
    const newViewPosition = {
      x: graph1.viewPosition.x,
      y: graph1.viewPosition.y,
    };
    const newName = graph1.name;
    const newNote = graph1.note;
    const newData = JSON.stringify(newNodes) + JSON.stringify(newEdges);
    const newGraph : Graph = {
      nodes: newNodes,
      edges: newEdges,
      viewPosition: newViewPosition,
      name: newName,
      note: newNote,
      data: newData,
    };
    return newGraph;
  };

  const confirmImportGraph = () => {
    const graph = graphToLoad; // graphToLoad is a React state string of the graph to be loaded. It is set before the confirm box is opened.
    const data = JSON.parse(graph?.data);
    let existingGraph = JSON.parse(stringifyGraph());
    console.log('existing graph', existingGraph);
    console.log('graph to load', JSON.parse(graphToLoad?.data));

    //merge the two graphs
    const newGraph = mergeGraphs(existingGraph, data);

    setGraph(newGraph);
    networkRef.current?.setData(newGraph);
      
  }
  
  const handleGraphSelected = (id: any) => {
    const graph = graphs?.find((g: any) => g.id === id);
    if (graph !== null) {
      setGraphToLoad(graph); // after confirming 'yes', the confirmLoadGraph function will be called, and will load this graph.
      setConfirmGraphLoadOpen(true);
    }
  };

  const handleGraphDelete = async (id: any) => {
    await axios.delete(`/api/graphs/${id}/`);
    await refreshList();
  };


  const onUndo = () => {
    if (historyListBack.length > 1) {
      const newHistoryForward : string = stringifyGraph();

      //previousGraph is second element in historyListBack
      const previousGraph : string = historyListBack[1];
      //remove first element with setHistoryListBack
      
      setHistoryListBack((state) => state.slice(1));
      loadGraphFromString(previousGraph);
      
      //save current graph to newHistoryForward
      setHistoryListForward((state) => [newHistoryForward, ...state]); 
    }

  }
  
  const onRedo = () => {
    if (historyListForward.length > 0) {
      
      //load graph from first element of historyListForward
      const nextGraph : string = historyListForward[0];
      
      //remove graph from historyListForward
      setHistoryListForward((state) => state.slice(1));

      //save nextGraph to historyListBack with setHistoryListBack
      setHistoryListBack((state) => [nextGraph, ...state]);
      loadGraphFromString(nextGraph);
    }

  }
  const deleteIfDeleteMode = () => { // this is a callback function for VisNetwork.tsx. When a node is clicked, this is run and the node is deleted if deleteMode is true.
    if (deleteModeRef.current) {
      networkRef.current?.network.deleteSelected();
    }
  }
  const addEdgeDirectedOrNot = (edge: any, edgeFnRef: any) => {
    edge.directed = addEdgeTypeRef.current === 'directed' ? true : false;
    networkRef.current?.triggerEvent("edge-added", {
      callback: edgeFnRef.current,
      edge,
    });
  }
  const onButton = (nextMode: string) => {
      setButtonMode(nextMode); // update buttonMode state so that the proper button will become selected.
      setDeleteMode(false); //default state for deleteMode. If the user selects any other button, deleteMode will be set to false.
      switch(nextMode) {  // update vis-network mode
        case "pan":
          networkRef.current?.network.disableEditMode();
          break;
        case "node":
          networkRef.current?.network.addNodeMode();
          break;
        case "directed-edge":
          networkRef.current?.network.addEdgeMode();
          setAddEdgeType("directed");
          break;
        case "edge":
          networkRef.current?.network.addEdgeMode();
          setAddEdgeType("undirected");
          break;
        case "delete":
          networkRef.current?.network.disableEditMode();  // disable any of the other modes, node edge, etc.
          setDeleteMode(true);
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
    //console.log('nodes', nodes);
    const positions = networkRef.current?.network.getPositions();

    if (nodes) {
      for (const node of nodes) {
        node.x = positions[node.id].x;
        node.y = positions[node.id].y;
      }

    }

    //create viewPosition using the getViewPosition function of vis-network
    const viewPosition = networkRef.current?.network.getViewPosition();

    return JSON.stringify({ edges, nodes, viewPosition });
  
  };

  async function saveGraphToDatabase(isNew: boolean = false) {
    
    const data = stringifyGraph();
    if (isNew) {
      await axios.post("/api/graphs/", {
        name: graphName, //graph is saved without an id, which will force the backend to save it as a new graph.
        note: graphNote,
        data: data,
      });
    } else {
      await axios.post("/api/graphs/", {
        id: graph?.id, //id is saved along with graph, so we can update the graph in the database, rather than create new.
        name: graphName,
        note: graphNote,
        data: data,
      });
    }  

    await refreshList();
  
  };
  
  async function getMetaMaskAccount() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    console.log('set metaMaskAccount', account);
    setMetaMaskAccount(account);
  };

  const handleSave = async () => {
    saveGraphToDatabase();
  };

  const handleSaveAsNew = async () => {
    saveGraphToDatabase(true);
  }

  useEffect(() => {
    refreshList();
    initializeUndoTimer();
  }, []);
  
  return (
    <Container>
      <Grid container spacing={0}>
        <Grid item>
          <Paper>
            <NetworkButtons
              networkRef={networkRef}
              onButton={onButton} // The function to handle button presses lives in App.tsx and is passed down here. This lets us set the button mode programmatically within App.tsx
              undoDisabled={historyListBack.length <= 1}
              redoDisabled={historyListForward.length === 0}
              onUndo={onUndo}
              onRedo={onRedo}
              buttonMode={buttonMode} // this is a React state string of which button is selected. It is passed to the NetworkButtons component which causes the appropriate button to be selected.
            />
            <Box
              sx={{
                display: 'flex',
                '& > *': {
                  m: 0,
                },
              }}
            >
              <ButtonGroup orientation="vertical">
                <Button variant="outlined" color="primary" onClick={handleSave} sx={{ 'margin-bottom': 'unset' }}>
                  Save
                </Button>
                <Button variant="outlined" color="primary" onClick={handleSaveAsNew} disabled={graph == null}>
                  Save As New
                </Button>
              </ButtonGroup>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={7}>
          <Paper>
            <ConfirmDialog
              title={graphToLoad && graphToLoad.name}
              open={confirmGraphLoadOpen}
              setOpen={setConfirmGraphLoadOpen}
              onConfirmReplace={confirmReplaceGraph}
              onConfirmImport={confirmImportGraph}
              canImportGraph={canImportGraph}
            >
            </ConfirmDialog>
            <VisNetwork
              networkRef={networkRef}
              addNodeComplete={addNodeComplete}
              addEdgeComplete={addEdgeComplete}
              historyListBack={historyListBack}
              historyListForward={historyListForward}
              historyListBackRef={historyListBackRef}
              setIsUserDragging={setIsUserDragging}
              stringifyGraph={stringifyGraph}
              deleteIfDeleteMode={deleteIfDeleteMode}
              addEdgeDirectedOrNot={addEdgeDirectedOrNot}
              buttonModeRef={buttonModeRef}
            />
            <Box m={5}>
              <TreeList Trees={trees} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <MetaMaskButton getMetaMaskAccount={getMetaMaskAccount} />
          <Paper>
            <Box m={1}>
              <TextField
                margin="normal"
                id="outlined-basic"
                label="Search"
                rows={1}
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                fullWidth
                InputProps={{ disableUnderline: true, endAdornment: <Button onClick={clearSearch} className="materialBtn">Clear</Button> }}
              />

            </Box>
          </Paper>
          <GraphList
            graphs={graphs}
            onGraphSelected={handleGraphSelected}
            onGraphDelete={handleGraphDelete}
            searchQuery={searchQuery}
          />
          <Card variant="outlined">
            <CardContent>
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
              {graph && (

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
              )}
            </CardContent>
          </Card>

        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
