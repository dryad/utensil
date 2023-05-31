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
import ConfirmLoadDialog from "./ConfirmLoadDialog";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import TreeList from "./Tree/TreeList";
import { Tree, Edge } from "models";
import MetaMaskButton from "./MetaMaskButton";
import { v4 as uuidv4 } from "uuid";
import WhitelistedAddresses from "./WhitelistedAddresses";

function Utensil() {
  const UNDO_STEPS_LIMIT = 250;

  const networkRef = useRef<VisCustomNetwork | null>(null);

  const [graphs, setGraphs] = useState<Graph[]>([]); // The list of graphs seen on the right hand side of the app.
  const [graph, setGraph] = useState<Graph | null>(null); // The currently loaded graph object.
  const [graphId, setGraphId] = useState<number | null>(null); // The currently loaded graph id. We save it separately from the graph, so it does not interfere with the undo stack
  const [graphToIdToLoad, setGraphIdToLoad] = useState<number | null>(null); // Before confirming a graph load, we store the id of the graph to be loaded. The id is not stored in the graph data, but we need it to communicate with the server.
  const [graphToLoad, setGraphToLoad] = useState<Graph | null>(null); // Before confirming a graph load, we store the graph to be loaded. This lets us show the name of the graph to the user.
  const [graphToDelete, setGraphToDelete] = useState<Graph | null>(null); // Before confirming a graph delete, we store the graph to be deleted. This lets us show the name of the graph to the user.
  const [graphName, setGraphName] = useState(""); // The name of the graph, used by the text box for Graph Name
  const [graphNote, setGraphNote] = useState(""); // The note of the graph, used by the text box for Graph Note
  const [historyListBack, setHistoryListBack, historyListBackRef] = useState([]); // The list of undo steps, for Undo.
  const [historyListForward, setHistoryListForward, historyListForwardRef] = useState([]); // The list of redo steps, for Redo.
  const [isUserDragging, setIsUserDragging, isUserDraggingRef] = useState(false); // Whether the user is currently dragging a node or the network. This temporarily disables the undo timer from saving steps.
  const [buttonMode, setButtonMode, buttonModeRef] = useState('pan'); // The button that is selected in the toolbar.
  const [searchQuery, setSearchQuery] = useState(""); // The search query, used by the text box for Search
  const [deleteMode, setDeleteMode, deleteModeRef] = useState(false); // Whether the user is currently in delete mode. This allows clicks to perform the delete action.
  const [addEdgeType, setAddEdgeType, addEdgeTypeRef] = useState("directed"); // The two add edge buttons enable "edge mode" in vis, but we store whether a directed or undirected edge should be created when the mouse is released.
  const [trees, setTrees] = useState<Tree[]>([]); // The list of trees shown on the bottom of the app.
  const [confirmGraphLoadOpen, setConfirmGraphLoadOpen] = useState(false); // Whether the user is currently confirming a graph load.
  const [confirmGraphDeleteOpen, setConfirmGraphDeleteOpen] = useState(false); // Whether the user is currently confirming a graph delete.
  const [metaMaskAccount, setMetaMaskAccount] = useState(""); // The metamask account that is currently selected.
  const [hoveredNodes, setHoveredNodes, hoveredNodesRef] = useState<string[]>([]); // The list of node IDs that are currently hovered.
  const [selectedNodes, setSelectedNodes, selectedNodesRef] = useState<string[]>([]); // The list of node IDs that are currently selected.
  
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

  const address_is_whitelisted = () => {
    return WhitelistedAddresses.includes(metaMaskAccount);
  }

  useEffect(() => {
    // console.log('new historyListBack', historyListBack);
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

  const setIsUserDraggingGlobal = (isUserDragging: boolean) => {
    setIsUserDragging(isUserDragging); // update the state, used by undo timer.
    window.isUserDragging = isUserDragging; // update the global variable, used to disable highlighting subordinate nodes when dragging, for performance.
    // console.log('set window.isUserDragging to: ', window.isUserDragging);
  }
  const refreshList = async () => {
    const { data } = await axios.get(`/api/graphs/?q=${searchQuery}`);
    setGraphs(data);
  };

  const testButton = () => {
    console.log('nodes', JSON.parse(stringifyGraph()).nodes);
    console.log('edges', JSON.parse(stringifyGraph()).edges);
    console.log('graph', stringifyGraph());
    console.log('metaMask', metaMaskAccount);
  };

  const getSelection = () => {
    console.log(networkRef.current?.network.getSelection());
  };

  const setHoveredChipToVis = (nodeId?: string) => { //nodeId can be null, in which case we clear the hovered nodes.
    networkRef.current?.network.setHover({node: nodeId});
  }

  const treeTraversal = async () => {

    let treeText = "";
    let nodes = networkRef.current?.nodes.get(); // get all nodes from the network.
    const edges = networkRef.current?.edges.get(); // get all edges from the network.
    const positions = networkRef.current?.network.getPositions();

    const to_traverse = [];
    const id_to_edge: any = {};
    const id_to_node: any = {};

    // gather nodes and skip labelNodes
    for (const node of nodes) {
      if (node.isLabelNode !== true) {
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

    function getLeftChild(node: any) {
      if (id_to_edge[node.id]) {
        return id_to_node[id_to_edge[node.id].from];
      }
      else {
        return null;
      }
    }
    function getRightChild(node: any) {
      if (id_to_edge[node.id]) {
        return id_to_node[id_to_edge[node.id].eventual];
      }
      else {
        return null;
      }
      
    }

    // this algorithm is well known 
    function inOrderTraversal(currentNode, treeList) {
      if (currentNode) {
        if (currentNode.level > 0) {
          treeList = inOrderTraversal(getLeftChild(currentNode), treeList);
          treeList.push(currentNode);
          treeList = inOrderTraversal(getRightChild(currentNode), treeList);
        }
        else {
          treeList.push(currentNode);
        }
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

  const setHoveredNodesFromNetwork = (hoveredNodes: string[]) => {
    setHoveredNodes(hoveredNodes);
  };

  const setSelectedNodesFromNetwork = (selectedNodes: string[]) => {
    setSelectedNodes(selectedNodes);
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
          scale: newGraph.scale || 1,
          animation: false,
        });
      }
    }
  };

  const confirmReplaceGraph = () => {
    const graph = graphToLoad; // graphToLoad is a React state string of the graph to be loaded. It is set before the confirm box is opened.
    setGraph(graph);
    setGraphId(graphToIdToLoad);

    setGraphName(graph?.name);
    setGraphNote(graph?.note);
    const data = JSON.parse(graph?.data);

    for (let node of data.nodes) {
      if (node.label && node.label.length > 0) {
        node.opacity = 1;
      }
      else {
        node.opacity = 0;
      }
    }

    networkRef.current?.setData(data);
      
    //clear Undo/Redo history
    // setHistoryListBack([]); // no longer clearing Undo steps on graph load. 
    setHistoryListForward([]);

    //Set button to pan mode when loading a new graph. Vis-network state will be in pan mode, so we want the button to show the pan tool.
    onButton('pan');
  }

  const confirmDeleteGraph = async () => {
    // this is run when the user confirms they want to delete a graph.
    console.log('delete confirmed, graph id: ', graphToDelete.id, graphToDelete.name);
    await axios.delete(`/api/graphs/${graphToDelete.id}/`);
    await refreshList();

  }

  const canImportGraph = () =>{
    const existingGraph = JSON.parse(stringifyGraph());
    return existingGraph.nodes && existingGraph.nodes.length > 0 ? true : false;
  }

  function mergeGraphs(graph1: Graph, graph2: Graph) {

    //calculate min(x), min(y), max(x), max(y) of graph1
    //quick and dirty calculation
    let x_values = [];
    let y_values = [];
    for (const node of graph1.nodes) {
      x_values.push(node.x);
      y_values.push(node.y);
    }
    const min_x = Math.min(...x_values);
    const min_y = Math.min(...y_values);
    const max_x = Math.max(...x_values);
    const max_y = Math.max(...y_values);

    console.log('min_x', min_x);
    console.log('min_y', min_y);
    console.log('max_x', max_x);
    console.log('max_y', max_y);

    const fullWidth = (max_x - min_x);
    const halfGraphWidth = fullWidth / 2;

    let renamed_nodes = {}; // old_id: new id

    // To prevent duplicate node IDs from the incoming graph, give each node a new id
    // first pass is non-labelNodes because we need a complete map of all nodes before labelNodes are processed, so we can update labelOfNode field of labelNodes.
    // alternative is to sort the nodes by isLabelNode, so it will process non-labelNodes first, then labelNodes second
    for (const node of graph2.nodes) {
      if (!node.isLabelNode) {
        const new_id = uuidv4();
        renamed_nodes[node.id] = new_id;
        node.id = new_id;
        node.x += fullWidth + 20; // apply offset calculated above
      }
    }

    // second pass is labelNodes, because renamed_nodes will be updated for all non-labelNodes
    for (const node of graph2.nodes) {
      if (node.isLabelNode) {
        const new_id = uuidv4();
        // renamed_nodes[node.id] = new_id; // we don't need to save labelNodes as renamed, they are not referred to in edge data
        node.id = new_id;
        node.labelOfNode = renamed_nodes[node.labelOfNode]; // update labelOfNode to point to the new id
      }
    }

    // To prevent duplicate edge IDs from the incoming graph, give each edge a new id
    for (const edge of graph2.edges) {
        const new_id = uuidv4();
        edge.id = new_id;

        //update from, to and eventual fields to point to the new node ids
        edge.from = renamed_nodes[edge.from];
        edge.to = renamed_nodes[edge.to];
        edge.eventual = renamed_nodes[edge.eventual];
    }

    const newNodes = [...graph1.nodes, ...graph2.nodes];
    const newEdges = [...graph1.edges, ...graph2.edges];
    const newViewPosition = {
      x: graph1.viewPosition.x,
      y: graph1.viewPosition.y,
      // scale: graph1.viewPosition.scale,
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
    for (let node of data.nodes) {
      if (node.label && node.label.length > 0) {
        node.opacity = 1;
      }
      else {
        node.opacity = 0;
      }
    }

    let existingGraph = JSON.parse(stringifyGraph());
    console.log('existing graph', existingGraph);
    console.log('graph to load', JSON.parse(graphToLoad?.data));

    //merge the two graphs
    const newGraph = mergeGraphs(existingGraph, data);

    setGraph(newGraph);
    networkRef.current?.setData(newGraph);
      
  }
  
  const setGraphFromNodesAndEdges = (nodes, edges) => { // receives new arrays of nodes and edges, used by merge node, and to update node opacity after a label edit
    // console.log('Setting snapped nodes and edges:', nodes, edges);
    const existingGraph = JSON.parse(stringifyGraph());
    existingGraph.nodes = nodes;
    existingGraph.edges = edges;
    setGraph(existingGraph);
    networkRef.current?.setData(existingGraph);
  };

  const handleGraphSelected = (id: any) => {
    const graph = graphs?.find((g: any) => g.id === id);
    if (graph !== null) {
      setGraphToLoad(graph); // after confirming 'yes', the confirmLoadGraph function will be called, and will load this graph.
      setGraphIdToLoad(id);
      setConfirmGraphLoadOpen(true);
    }
  };

  const handleGraphDelete = (id: any) => {
    //set the graph to be potentially deleted
    const graph = graphs?.find((g: any) => g.id === id);
    if (graph !== null) {
      setGraphToDelete(graph); // after confirming 'yes', the confirmDeleteGraph function will be called, and will delete this graph from the database.
      setConfirmGraphDeleteOpen(true);
    } 
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
        case "contraction":
          networkRef.current?.network.disableEditMode();
          setSelectedNodesFromNetwork([]);
          break;  
        case "expansion":
          networkRef.current?.network.disableEditMode();
          setSelectedNodesFromNetwork([]);
          break;    
      }
      
  };

  useEffect(() => {
    if (buttonMode === "contraction") {
      if (selectedNodes.length === 1) {
        const nodes = networkRef.current?.nodes.get();
        console.log(nodes)
        const foundSelectedNode = nodes.filter((node: any) => node.id === selectedNodes[0])[0];
        
        if (
          foundSelectedNode?.level > 0 && 
          foundSelectedNode.isLabelNode !== true && 
          !foundSelectedNode.hasOwnProperty('hasDefinition')
        ) {
          const {canBeContracted, subGraphData, externalGraphData} = contractAction(foundSelectedNode);
console.log(canBeContracted, subGraphData, externalGraphData)
          if (canBeContracted) {
            const viewPosition = networkRef.current?.network.getViewPosition();
            const scale = networkRef.current?.network.getScale();

            const subGraphObject = { 
              edges: subGraphData?.edges, 
              nodes: subGraphData?.nodes, 
              viewPosition: viewPosition, 
              scale: scale 
            };
            const subGraph = JSON.stringify(subGraphObject);
            const graphFromDBloaded = getGraphById(graphId); 
            const graphFromDB = JSON.parse(graphFromDBloaded.data);

            const {
              nodesIdSet: subGraphNodesIdsSet, 
              edgesIdSet: subGraphEdgesIdsSet, 
              labelsMap: subGraphLabels,
              labelsHasDefinitionMap: map1
            } = graphIdsTraversal(subGraphData);

            const {
              nodesIdSet: graphNodesIdsSet, 
              edgesIdSet: graphEdgesIdsSet,
              labelsMap: graphFromDBLabels,
              labelsHasDefinitionMap: map2
            } = graphIdsTraversal(graphFromDB);

            const subGraphIsEqualGraphFromDBByIds = areSetsEqual(subGraphEdgesIdsSet, graphEdgesIdsSet) &&
                                                    areSetsEqual(subGraphNodesIdsSet, graphNodesIdsSet);

            let subGraphIsEqualGraphFromDBByLabels = true;

            if (subGraphIsEqualGraphFromDBByIds) {
              for (const id of Array.from(graphNodesIdsSet)) {
                if ((subGraphLabels.has(id)) && (subGraphLabels.get(id) !== graphFromDBLabels.get(id))) {
                  subGraphIsEqualGraphFromDBByLabels = false;
                  break;
                } 
              }
            } else {
              subGraphIsEqualGraphFromDBByLabels = false;
            }
                  
            const { contractedNodesHaveEqualLabels } = compareGraphsByContractedNodesLabels(map1, map2);         
            const label = subGraphIsEqualGraphFromDBByLabels && contractedNodesHaveEqualLabels ? graphFromDBloaded?.name : '';
            
            const updatedNodes = externalGraphData?.nodes.map((el: any) => {
              if (el.id === externalGraphData.nodeId) {
                el.label = label;
                el.font = {color: "#fff"};
                el.hasDefinition = true;
                el.subGraphData = subGraph;
                el.shape = "hexagon";
                el.opacity = label === '' ? 0 : 1;
              }
              if (el.labelOfNode === externalGraphData.nodeId) {
                el.label = label;
                el.font = {
                  size: 14,
                  color: "#000000",
                };
                el.opacity = 1;
              }
              return el;
            })
                        
            const externalGraph = JSON.parse(stringifyGraph());
            externalGraph.nodes = updatedNodes;
            externalGraph.edges = externalGraphData?.edges;
            networkRef.current?.setData(externalGraph);
          }
        }
      }
    }
  }, [selectedNodes, buttonMode]);
  
  function graphIdsTraversal(graphData: any) {
    let nodesIdSet = new Set();
    let edgesIdSet = new Set();
    let labelsMap = new Map();
    let labelsHasDefinitionMap = new Map();
    
    graphData.edges.forEach((edge:any) => {
      edgesIdSet.add(edge.id);
    });
console.log(graphData.nodes)
    graphData.nodes.forEach((node:any) => {
      console.log(node)
      recursionNodesIdTraversal(node);  
    });

    function recursionNodesIdTraversal(node: any) {
      if (node.hasOwnProperty('hasDefinition')) {
        labelsHasDefinitionMap.set(node.id, node.label);
        const arrayNodes = JSON.parse(node.subGraphData).nodes;
        const arrayEdges = JSON.parse(node.subGraphData).edges;
        arrayEdges.forEach((edge: any) => edgesIdSet.add(edge.id));
        arrayNodes.forEach((node: any) => recursionNodesIdTraversal(node));
      }
      else {
        nodesIdSet.add(node.id);
        if (!node.hasOwnProperty('isLabelNode')) {
          labelsMap.set(node.id, node.label);
        }
      }
    }
    return {nodesIdSet, edgesIdSet, labelsMap, labelsHasDefinitionMap};
  }

  function areSetsEqual(a: any, b: any) {
    return a.size === b.size && [...a].every(value => b.has(value));
  } 

  function contractAction(selNode:any) {
    const nodes = networkRef.current?.nodes.get();
    const edges = networkRef.current?.edges.get();

    const edgeToSelNode = edges.filter((el: any) => el.to === selNode.id); 
    
    let subGraphNodes = new Set();
    let subGraphEdges = new Set();

    const fromNodes = nodes.filter((el: any) => el.id === edgeToSelNode[0].from || el?.labelOfNode === edgeToSelNode[0].from);
    const eventualNodes = nodes.filter((el: any) => el.id === edgeToSelNode[0].eventual || el?.labelOfNode === edgeToSelNode[0].eventual);

    fromNodes.forEach((el: any) => subGraphNodes.add(el));
    eventualNodes.forEach((el:any) => subGraphNodes.add(el));
    subGraphEdges.add(edgeToSelNode[0]);

    let newNodes: any[] = Array.from(subGraphNodes);
    let arrayNodes: any[] = Array.from(subGraphNodes);

    for (let i = selNode.level - 1; i > 0; i--) {
      for (const node of arrayNodes) {
               
        if (node.level === i) {
          const e = edges.filter((el: any) => el.to === node.id);
          
          if (e.length > 0) {
            const fromTempNodes = nodes.filter((el: any) => el.id === e[0].from || (el.isLabelNode === true && el?.labelOfNode === e[0].from));
            const eventualTempNodes = nodes.filter((el: any) => el.id === e[0].eventual || (el.isLabelNode === true && el?.labelOfNode === e[0].eventual));
  
            newNodes.push(...fromTempNodes);
            newNodes.push(...eventualTempNodes);
            subGraphEdges.add(e[0]);
          }
        }
      }
      subGraphNodes = new Set(newNodes);
      arrayNodes = Array.from(subGraphNodes);
    }

    const externalEdgesSet = new Set(edges.filter((e: any) => !subGraphEdges.has(e))); 
    
    let canBeContracted = true;
    let subGraphNodeIdsSet = new Set();

    for (const node of Array.from(subGraphNodes)) {
      if (node.isLabelNode !== true) {
        subGraphNodeIdsSet.add(node.id);
      }
    }

    // define if subGraph can be contracted
    for (const edge of Array.from(externalEdgesSet)) {
      if ((subGraphNodeIdsSet.has(edge.from) || subGraphNodeIdsSet.has(edge.eventual))
        && !subGraphNodeIdsSet.has(edge.to)) {
          canBeContracted = false;
      }
    }

    let externalNodesSet = new Set();
    let subGraphData;
    let externalGraphData;

    if (canBeContracted) {
      externalNodesSet = new Set(nodes.filter((node: any) => !subGraphNodes.has(node)));
      subGraphData = {
        edges: Array.from(subGraphEdges),
        nodes: Array.from(subGraphNodes),
        nodeId: selNode.id
      };
      const selectedNodeHasLabel = nodes.filter((node: any) => node.labelOfNode === selNode.id)[0];
      subGraphData?.nodes.push(selNode);
      selectedNodeHasLabel && subGraphData?.nodes.push(selectedNodeHasLabel);

      externalGraphData = {
        edges: Array.from(externalEdgesSet),
        nodes: Array.from(externalNodesSet),
        nodeId: selNode.id
      };
    }
      
    return {canBeContracted, subGraphData, externalGraphData}
  }

  function compareGraphsByContractedNodesLabels(map1: any, map2: any) {
    let contractedNodesHaveEqualLabels = true;

    map1.forEach((value1: string, key1: string) => {
      const value2 = map2.get(key1);
      if (value2 && value2 !== value1) {
        contractedNodesHaveEqualLabels = false;
      }
      if (!value2 && value1 !== '') {
        contractedNodesHaveEqualLabels = false;
      }
    });

    map2.forEach((value2: string, key2: string) => {
      const value1 = map1.get(key2);
      if (value1 && value1 !== value2) {
        contractedNodesHaveEqualLabels = false;
      }
      if (!value1 && value2 !== '') {
        contractedNodesHaveEqualLabels = false;
      }
    });

    return { contractedNodesHaveEqualLabels }
  }

  const getGraphById = (id: number | null) => {
    const foundGraph = graphs.filter((graph: Graph) => graph.id === id);
    return foundGraph[0]
  } 

  useEffect(() => {
    if (buttonMode === "expansion") {
      if (selectedNodes.length === 1) {
        const nodes = networkRef.current?.nodes.get();
        const edges = networkRef.current?.edges.get();
        const foundSelectedNode = nodes.filter((node: any) => node.id === selectedNodes[0])[0];
       
        if (foundSelectedNode.hasOwnProperty('hasDefinition')) {
          const subGraphData = JSON.parse(foundSelectedNode.subGraphData);
          const updatedEdges = edges.concat(subGraphData.edges);
          const updatedNodes = nodes
            .filter((node: any) => node.id !== foundSelectedNode.id && node.labelOfNode !== foundSelectedNode.id)
            .concat(subGraphData.nodes);

          const expansedGraph = JSON.parse(stringifyGraph());
          expansedGraph.nodes = updatedNodes;
          expansedGraph.edges = updatedEdges;
          networkRef.current?.setData(expansedGraph);
        }
      }
    }
  },[selectedNodes, buttonMode]) 

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
    const scale = networkRef.current?.network.getScale();
    return JSON.stringify({ edges, nodes, viewPosition, scale });
  
  };

  async function saveGraphToDatabase(isNew: boolean = false) {
    
    const data = stringifyGraph();
    if (isNew) {
      await axios.post("/api/graphs/", {
        name: graphName, //graph is saved without an id, which will force the backend to save it as a new graph.
        note: graphNote,
        data: data,
      }).then(response => {
          //The new id of the graph is returned by the backend. We save it to the state in the graph object. This will activate the "save" button and let us update the graph on the server.
          if (response.data.id) {
            console.log('Saved graph to the database with this id: ', response.data.id);
            setGraphId(parseInt(response.data.id));
          }
        });
    } else {
      await axios.post("/api/graphs/", {
        id: graphId, //id is sent along with the graph, so we can update the graph in the database, rather than create new.
        name: graphName,
        note: graphNote,
        data: data,
      });
    }  

    await refreshList();
  
  };
  
  async function getMetaMaskAccount() {
    if (typeof ethereum !== 'undefined') {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      console.log('set metaMaskAccount', account);
      setMetaMaskAccount(account);
    }
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
    getMetaMaskAccount();
  }, []);
  
  return (
    <Container>
      <Grid container spacing={0}>
        <Grid item>
          <Paper>
            <NetworkButtons
              networkRef={networkRef}
              onButton={onButton} // The function to handle button presses lives in Utensil.tsx and is passed down here. This lets us set the button mode programmatically within Utensil.tsx
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
                <Button variant="outlined" color="primary" onClick={handleSave} sx={{ 'margin-bottom': 'unset' }} disabled={graphId == null}>
                  Save
                </Button>
                <Button variant="outlined" color="primary" onClick={handleSaveAsNew}>
                  Save As New
                </Button>
                {/* <Button variant="outlined" color="primary" onClick={handleClearGraph}>
                  Clear Graph
                </Button> */}
                { address_is_whitelisted() && (
                  <>
                  <Button variant="outlined" color="primary" onClick={testButton}>
                    Test
                  </Button>
                  Graph ID: {graphId}
                  </>
                )}
                
                
              </ButtonGroup>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={7}>
          <Paper>
            <ConfirmLoadDialog
              title={graphToLoad && graphToLoad.name}
              open={confirmGraphLoadOpen}
              setOpen={setConfirmGraphLoadOpen}
              onConfirmReplace={confirmReplaceGraph}
              onConfirmImport={confirmImportGraph}
              canImportGraph={canImportGraph}
            >
            </ConfirmLoadDialog>
            <ConfirmDeleteDialog
              title={graphToDelete && graphToDelete.name}
              open={confirmGraphDeleteOpen}
              setOpen={setConfirmGraphDeleteOpen}
              onConfirmDelete={confirmDeleteGraph}
            >
            </ConfirmDeleteDialog>
            <VisNetwork
              networkRef={networkRef}
              addNodeComplete={addNodeComplete}
              addEdgeComplete={addEdgeComplete}
              historyListBack={historyListBack}
              historyListForward={historyListForward}
              historyListBackRef={historyListBackRef}
              setIsUserDragging={setIsUserDraggingGlobal}
              stringifyGraph={stringifyGraph}
              deleteIfDeleteMode={deleteIfDeleteMode}
              setGraphFromNodesAndEdges={setGraphFromNodesAndEdges}
              addEdgeDirectedOrNot={addEdgeDirectedOrNot}
              buttonModeRef={buttonModeRef}
              hoveredNodes={hoveredNodesRef}
              setHoveredNodesFromNetwork={setHoveredNodesFromNetwork}
              selectedNodes={selectedNodesRef}
              setSelectedNodesFromNetwork={setSelectedNodesFromNetwork}
            />
            <Box m={5}>
              <TreeList Trees={trees} hoveredNodes={hoveredNodesRef} selectedNodes={selectedNodesRef} setHoveredChipToVis={setHoveredChipToVis}/>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper sx={{'height': "50px", 'backgroundColor': 'transparent', 'border': 'none'}}>
          <MetaMaskButton getMetaMaskAccount={getMetaMaskAccount} />
          </Paper>
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
            address_is_whitelisted={address_is_whitelisted}
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

export default Utensil;
