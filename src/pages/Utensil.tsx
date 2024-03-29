import _ from "lodash";
import { useRef, useEffect } from "react";
import VisCustomNetwork from "libs/vis-custom-network";
import VisNetwork from "components/VisNetwork";
import NetworkButtons from "components/NetworkButtons";
import useState from 'react-usestateref';
import { Tree, TreeNode, Edge, Graph, GraphData } from "models";
import { v4 as uuidv4 } from "uuid";
import WhitelistedAddresses from "components/WhitelistedAddresses";
import { contractAction, contractedNodeName } from "components/ContractButtonFunctions";
import { NODE_COLORS } from "constants/colors";
import { useComputeFunctionalGraph } from 'hooks/useComputeFunctionalGraph';
import EmptyUtensilPopUp from 'components/EmptyUtensilPopUp';
import ZoomActions from 'components/ZoomActions';
import Navbar from "layout/Navbar";
import functionalGraphData from "functions/functionalGraphIds.json"; 
import { getAllGraphs } from 'services/axiosRequests';
import { stringifyCurrentGraph } from 'components/networkFunctions';
import { useGraphStore } from 'store/GraphStore';
import { useMetaMaskAccountStore } from 'store/MetaMaskAccountStore';
import { useShallow } from 'zustand/react/shallow'
import { useUtensilModalStore } from "store/UtensilModalStore";

function Utensil() {
  const UNDO_STEPS_LIMIT = 250;

  const [selectedGraph, clickCloseButton, setOpenUtensilModal, setShowWarningUnsaved, setClickCloseButton] = useUtensilModalStore(
    useShallow((state) => [
      state.selectedGraph,
      state.clickCloseButton,
      state.setOpenUtensilModal,
      state.setShowWarningUnsaved,
      state.setClickCloseButton
    ])
  );

  const networkRef = useRef<VisCustomNetwork | null>(null);
  const [publicPrivateGraphs, setPublicPrivateGraphs] = useState<Graph[]>([]); // The list of all public and current user private graphs
  const [graph, setGraph] = useState<GraphData | null>(null); // The currently loaded graph object.
  const [graphToIdToLoad, setGraphIdToLoad] = useState<number | null>(null); // Before confirming a graph load, we store the id of the graph to be loaded. The id is not stored in the graph data, but we need it to communicate with the server.
  const [graphToLoad, setGraphToLoad] = useState<Graph | null | undefined>(null); // Before confirming a graph load, we store the graph to be loaded. This lets us show the name of the graph to the user.
  const [historyListBack, setHistoryListBack, historyListBackRef] = useState([]); // The list of undo steps, for Undo.
  const [historyListForward, setHistoryListForward, historyListForwardRef] = useState([]); // The list of redo steps, for Redo.
  const [isUserDragging, setIsUserDragging, isUserDraggingRef] = useState(false); // Whether the user is currently dragging a node or the network. This temporarily disables the undo timer from saving steps.
  const [buttonMode, setButtonMode, buttonModeRef] = useState('pan'); // The button that is selected in the toolbar.
  const [deleteMode, setDeleteMode, deleteModeRef] = useState(false); // Whether the user is currently in delete mode. This allows clicks to perform the delete action.
  const [addEdgeType, setAddEdgeType, addEdgeTypeRef] = useState("directed"); // The two add edge buttons enable "edge mode" in vis, but we store whether a directed or undirected edge should be created when the mouse is released.
  const [trees, setTrees] = useState<Tree[]>([]); // The list of trees shown on the bottom of the app.
  const [hoveredNodes, setHoveredNodes, hoveredNodesRef] = useState<string[]>([]); // The list of node IDs that are currently hovered.
  const [selectedNodes, setSelectedNodes, selectedNodesRef] = useState<string[]>([]); // The list of node IDs that are currently selected.
  const [isEmptyUtensil, setIsEmptyUtensil] = useState(selectedGraph === null);
  const [isAddShapeButtonClicked, setIsAddShapeButtonClicked] = useState(false);
  const [toCloseBar, setToCloseBar] = useState(false);
  const stringifyGraph = () => stringifyCurrentGraph(networkRef);

  const [graphName, graphNote, isDeletedGraph, setGraphName, setGraphNote, setIsPrivate, setGraphCreator, setGraphId, setIsDeletedGraph, setPrevGraphName, setPrevGraphNote, setPrevGraphPrivate] = useGraphStore(
    useShallow((state) => [
      state.graphName, 
      state.graphNote,
      state.isDeletedGraph,
      state.setGraphName,
      state.setGraphNote,
      state.setIsPrivate,
      state.setGraphCreator,
      state.setGraphId, 
      state.setIsDeletedGraph, 
      state.setPrevGraphName,
      state.setPrevGraphNote,
      state.setPrevGraphPrivate,  
    ])
  );

  // The metamask account that is currently selected.
  const [metaMaskAccount] = useMetaMaskAccountStore(
    useShallow((state) => [
      state.metaMaskAccount,
    ])
  );

  useEffect(() => {
    // setIsPrivate(graphToLoad ? graphToLoad.private !== '' : false);
    setPrevGraphName(graphToLoad ? graphToLoad.name : '');
    setPrevGraphNote(graphToLoad ? graphToLoad.note : '');
    setPrevGraphPrivate(graphToLoad ? graphToLoad.private !== '' : false);
  },[graphToLoad]);

  useComputeFunctionalGraph(networkRef);

  useEffect(() => {
    if (selectedGraph) {
      const data = JSON.parse(selectedGraph.data);
      
      const nodesLevels = data.nodes.map((el: TreeNode) => el.level);
      const maxLevelOfNodes = Math.max(...nodesLevels);

      data.nodes.map((el: TreeNode) => {
        if (el.level === maxLevelOfNodes && !el.isLabelNode && functionalGraphData.hasOwnProperty(selectedGraph.id!)) {
          el.subGraphId = selectedGraph.id;
        }
        if (el.opacity === 1 && el.level === maxLevelOfNodes && !el.isLabelNode && functionalGraphData.hasOwnProperty(selectedGraph.id!)) {
          el.isUneditable = true;
        }
        
        return el;
      })
      
      networkRef.current?.setData(data);
      setGraphName(selectedGraph.name);
      setGraphNote(selectedGraph.note);
      setGraphId(selectedGraph.id!);
      setIsPrivate(selectedGraph.private !== '');
      setPrevGraphName(selectedGraph.name);
      setPrevGraphNote(selectedGraph.note);
      setPrevGraphPrivate(selectedGraph.private !== '');
    }
  },[selectedGraph]);  

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
  }, [metaMaskAccount]);

  useEffect(() => {
    console.log('Switching to buttonMode: ', buttonMode); // when the text of the search query changes, we want to refresh the list of graphs.
  }, [buttonMode]);

  const setIsUserDraggingGlobal = (isUserDragging: boolean) => {
    setIsUserDragging(isUserDragging); // update the state, used by undo timer.
    window.isUserDragging = isUserDragging; // update the global variable, used to disable highlighting subordinate nodes when dragging, for performance.
    // console.log('set window.isUserDragging to: ', window.isUserDragging);
  }

  const refreshList = async () => {
    getAllGraphs(metaMaskAccount)
    .then(res => {
      if (Array.isArray(res.data)) {
        setPublicPrivateGraphs(res.data)
      } 
      else {
        setPublicPrivateGraphs([])
      }
    })  
    .catch(err => {if (err) {setPublicPrivateGraphs([])}});
  } 

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
    let edges = networkRef.current?.edges.get(); // get all edges from the network.
    
    const positions = networkRef.current?.network.getPositions();
    console.log('all nodes: ', nodes)
    console.log('all edges: ', edges)
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
    function getRightChild(node: TreeNode) {
      if (id_to_edge[node.id]) {
        return id_to_node[id_to_edge[node.id].eventual];
      }
      else {
        return null;
      }
      
    }

    // this algorithm is well known 
    function inOrderTraversal(currentNode: TreeNode, treeList: TreeNode[]) {
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
    function getStartNode(traversedSet: Set<TreeNode>) {
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
    
    var parseList = [];
    if (to_traverse.length > 0) {
      var traversedSet: Set<TreeNode> = new Set();

      for (let i = 0; i < to_traverse.length; i++) { // avoid while loop
        var treeList: TreeNode[] = [];
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
      const newGraph : GraphData = JSON.parse(graph);

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
    if (graphToLoad) {      
      const graph = graphToLoad; // graphToLoad is a React state string of the graph to be loaded. It is set before the confirm box is opened.
      setGraph(JSON.parse(graph.data));
      setIsPrivate(graph.private !== '');
      setGraphId(graphToIdToLoad);
  
      setGraphName(graph.name);
      setGraphNote(graph.note);
      setGraphCreator(graph.creator);
      const data = JSON.parse(graph.data);
  
      const nodesLevels = data.nodes.map((el: TreeNode) => el.level);
      const maxLevelOfNodes = Math.max(...nodesLevels);

      data.nodes.map((el: TreeNode) => {
        if (el.level === maxLevelOfNodes && !el.isLabelNode && functionalGraphData.hasOwnProperty(graphToLoad.id!)) {
          el.subGraphId = graphToLoad.id;
        }
        if (el.opacity === 1 && el.level === maxLevelOfNodes && !el.isLabelNode && functionalGraphData.hasOwnProperty(graphToLoad.id!)) {
          el.isUneditable = true;
        }

        return el;
      })

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
  }

  useEffect(() => {
    if (isDeletedGraph) {
      refreshList();
      initializeUndoTimer();
      setGraphName('');
      setGraphNote('');
      setGraphCreator('');
      setGraphId(null);

      const existingGraph = JSON.parse(stringifyCurrentGraph(networkRef));
      existingGraph.nodes = [];
      existingGraph.edges = [];
      setGraph(existingGraph);
      networkRef.current?.setData(existingGraph);
      setToCloseBar(true);
    }
  },[setIsDeletedGraph, isDeletedGraph])

  
  const canImportGraph = () =>{
    const existingGraph = JSON.parse(stringifyGraph());
    return existingGraph.nodes && existingGraph.nodes.length > 0 ? true : false;
  }

  function mergeGraphs(graph1: any, graph2: any, xValue: number = 0, yValue: number = 0) {
    
    //calculate min(x), min(y), max(x), max(y) of graph1
    //quick and dirty calculation
    let x_values = [];
    let y_values = [];
    for (const node of graph1.nodes) {
      x_values.push(node.x);
      y_values.push(node.y);
    }
    
    const min_x = x_values.length === 0 ? 0 : Math.min(...x_values);
    const min_y = y_values.length === 0 ? 0 : Math.min(...y_values);
    const max_x = x_values.length === 0 ? xValue : Math.max(...x_values);
    const max_y = y_values.length === 0 ? yValue : Math.max(...y_values);

    console.log('min_x', min_x);
    console.log('min_y', min_y);
    console.log('max_x', max_x);
    console.log('max_y', max_y);

    const fullWidth = (max_x - min_x);
    const fullHeight = max_y - min_y;
    const halfGraphWidth = fullWidth / 2;

    let renamed_nodes: {[index: string]: string} = {}; // old_id: new id

    // To prevent duplicate node IDs from the incoming graph, give each node a new id
    // first pass is non-labelNodes because we need a complete map of all nodes before labelNodes are processed, so we can update labelOfNode field of labelNodes.
    // alternative is to sort the nodes by isLabelNode, so it will process non-labelNodes first, then labelNodes second
    for (const node of graph2.nodes) {
      if (!node.isLabelNode) {
        const new_id = uuidv4();
        renamed_nodes[node.id] = new_id;
        if (node.subGraphData) {
          const newSubgraphData = renameSubgraphIds(JSON.parse(node.subGraphData), node.id, new_id, fullWidth, fullHeight);
          node.subGraphData = JSON.stringify(newSubgraphData);
        }
        node.id = new_id;
        node.x += fullWidth + 20; // apply offset calculated above
        node.y += fullHeight + 20;
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
    const newGraph = {
      nodes: newNodes,
      edges: newEdges,
      viewPosition: newViewPosition,
      name: newName,
      note: newNote,
      data: newData,
    };
    return newGraph;
  };

  function renameSubgraphIds(graph: any, oldId: string, newId: string, fullWidth: number, fullHeight: number) {
    
    let renamed_nodes: {[index: string]: string} = {};

    for (const node of graph.nodes) {
      if (!node.isLabelNode) {
        const new_id = node.id === oldId ? newId : uuidv4();
        renamed_nodes[node.id] = new_id;
        if (node.subGraphData) {
          const newSubgraphData = renameSubgraphIds(JSON.parse(node.subGraphData),node.id, new_id, fullWidth, fullHeight);
          node.subGraphData = JSON.stringify(newSubgraphData);
        }
        node.id = new_id;
        node.x += fullWidth + 20;
        node.y += fullHeight + 20;
      }
    }

    for (const node of graph.nodes) {
      if (node.isLabelNode) {
        const new_id = uuidv4();
        node.id = new_id;
        node.labelOfNode = renamed_nodes[node.labelOfNode]; 
      }
    }

    for (const edge of graph.edges) {
        const new_id = uuidv4();
        edge.id = new_id;

        edge.from = renamed_nodes[edge.from];
        edge.to = renamed_nodes[edge.to];
        edge.eventual = renamed_nodes[edge.eventual];
    }
    
    return graph;
  }

  const confirmImportGraph = () => {
    if (graphToLoad) {
      const graph = graphToLoad; // graphToLoad is a React state string of the graph to be loaded. It is set before the confirm box is opened.
      const data = JSON.parse(graph.data);

      for (let node of data.nodes) {
        if (node.label && node.label.length > 0) {
          node.opacity = 1;
        }
        else {
          node.opacity = 0;
        }
      }

      const nodesLevels = data.nodes.map((el: TreeNode) => el.level);
      const maxLevelOfNodes = Math.max(...nodesLevels);

      data.nodes.map((el: TreeNode) => {
        if (el.level === maxLevelOfNodes && !el.isLabelNode && functionalGraphData.hasOwnProperty(graphToLoad.id!)) {
          el.subGraphId = graphToLoad.id;
        }

        if (el.opacity === 1 && el.level === maxLevelOfNodes && !el.isLabelNode && functionalGraphData.hasOwnProperty(graphToLoad.id!)) {
          el.isUneditable = true;
        }

        return el;
      })
      const stringifyCurGraph = stringifyGraph();
      let existingGraph = JSON.parse(stringifyCurGraph);
      console.log('existing graph', existingGraph);
      console.log('graph to load', JSON.parse(graphToLoad.data));

      //merge the two graphs
      const newGraph = mergeGraphs(existingGraph, data);

      setGraph(newGraph);
      networkRef.current?.setData(newGraph);
    }
  }
  
  const setGraphFromNodesAndEdges = (nodes: TreeNode[], edges: Edge[]) => { // receives new arrays of nodes and edges, used by merge node, and to update node opacity after a label edit
    // console.log('Setting snapped nodes and edges:', nodes, edges);
    const stringifyCurGraph = stringifyGraph();
    const existingGraph = JSON.parse(stringifyCurGraph);
    existingGraph.nodes = nodes;
    existingGraph.edges = edges;
    setGraph(existingGraph);
    networkRef.current?.setData(existingGraph);
  };

  const handleGraphSelected = (id: number) => {
    const graph = publicPrivateGraphs.find((g: Graph) => g.id === id);
    if (graph) {
      setGraphToLoad(graph); // after confirming 'yes', the confirmLoadGraph function will be called, and will load this graph.
      setGraphIdToLoad(id);
      // setConfirmGraphLoadOpen(true);
    }
  };

  const [importGraphToggle, setImportGraphToggle] = useState(false);
  useEffect(() => {
    confirmImportGraph();
  },[importGraphToggle])

  const handleGraphImport = (id: number) => {
    const graphFromDB = publicPrivateGraphs.find((g: Graph) => g.id === id)!;
    
    const emptyGraph = graphFromDB && {
      edges: [],
      nodes: [],
      scale: JSON.parse(graphFromDB.data).scale,
      viewPosition: JSON.parse(graphFromDB.data).viewPosition,
    }

    const nodesCanvas = networkRef.current?.nodes.get();
    const edgesCanvas = networkRef.current?.edges.get();

    const replacedNode = nodesCanvas.find((node: any) => node.id === selectedNodes[0]);
    const replacedLabelNode = nodesCanvas.find((node: any) => node.labelOfNode === replacedNode.id);

    const graphWithNewIds = graphFromDB && mergeGraphs(emptyGraph, JSON.parse(graphFromDB.data), replacedNode.x, replacedNode.y);

    const nodes = graphWithNewIds.nodes;
    const edges = graphWithNewIds.edges;
    
    const maxLevelNode = nodes
      .filter((el: TreeNode) => {return !el.hasOwnProperty('isLabelNode')})
      .reduce((prev: TreeNode, current: TreeNode) => (prev.level > current.level) ? prev : current)
        
    const {canBeContracted} = contractAction(maxLevelNode, nodes, edges);
    console.log('node with max level ---', maxLevelNode);
    console.log('canBeContracted --', canBeContracted);
    
    if (graphWithNewIds && canBeContracted && (replacedNode.level === 0 || replacedNode.shape === 'hexagon')) {
            
      console.log('labeled node ---',replacedNode, replacedLabelNode);

      changeNodesLevels(replacedNode, maxLevelNode.level, nodesCanvas, edgesCanvas);  

      const updatedEdges = edgesCanvas
        .concat(edges)
        .map((el: Edge) => {
          if (el.from === replacedNode.id) {
            el.from = maxLevelNode.id;
          }
          if (el.eventual === replacedNode.id) {
            el.eventual = maxLevelNode.id;
          }
          return el;
        });;
      
      const viewPosition = networkRef.current?.network.getViewPosition()!;
      const scale = networkRef.current?.network.getScale();
      
      const updatedNodes = nodesCanvas
        .filter((node: TreeNode) => node.id !== replacedNode.id && node.labelOfNode !== replacedNode.id)
        .concat(nodes)
      
      const newGraph = JSON.parse(stringifyGraph());
      newGraph.nodes = updatedNodes;
      newGraph.edges = updatedEdges;
      networkRef.current?.setData(newGraph);
      networkRef.current?.network.moveTo({
        position: { x: viewPosition.x, y: viewPosition.y },
        scale: scale || 1,
        animation: false,
      });
          
      return canBeContracted && (replacedNode.level === 0 || replacedNode.shape === 'hexagon')
    }

    if (graphFromDB && (!canBeContracted || replacedNode.level !== 0)) {
      setGraphToLoad(graphFromDB); 
      setGraphIdToLoad(id);
      setImportGraphToggle(prev => !prev);
      
      return !(!canBeContracted || replacedNode.level !== 0)
    }        
  };

  const changeNodesLevels = (node: TreeNode, maxLevel: number, nodes: TreeNode[], edges: Edge[]) => {
    const tempEdge = edges.find((el) => {
      return el.from === node.id || el.eventual === node.id
    });
    
    if (tempEdge) {
      const toNode = nodes.find((el) => el.id === tempEdge.to)!;
      
      nodes.map((el) => {
        if (el.id === toNode.id) {
          el.level = maxLevel + 1;
          el.color = NODE_COLORS[el.level];
        }
        if (el.labelOfNode === toNode.id) {
          el.level = maxLevel + 1;
        }
        return el;
      })
      changeNodesLevels(toNode, maxLevel + 1, nodes, edges);
    }
  }

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
        const edges = networkRef.current?.edges.get();
        
        console.log('all nodes: ',nodes)
        console.log('all edges', edges)
        
        const foundSelectedNode = nodes.find((node: any) => node.id === selectedNodes[0]);
        console.log('contracted node ---',foundSelectedNode)
        
        if (
          foundSelectedNode?.level > 0 && 
          foundSelectedNode.isLabelNode !== true && 
          !foundSelectedNode.hasOwnProperty('subGraphData')
        ) {
          const {canBeContracted, subGraphData, externalGraphData} = contractAction(foundSelectedNode, nodes, edges);
          console.log('contraction data (subGraph, extraGraph): ', subGraphData, externalGraphData);

          if (canBeContracted && subGraphData && externalGraphData) {
            const viewPosition = networkRef.current?.network.getViewPosition()!;
            const scale = networkRef.current?.network.getScale();

            const subGraphObject = { 
              edges: subGraphData?.edges, 
              nodes: subGraphData?.nodes, 
              viewPosition: viewPosition, 
              scale: scale 
            };
            const subGraph = JSON.stringify(subGraphObject);
            let nodeName = '';
            
            if (foundSelectedNode.hasOwnProperty('subGraphId')) {
              const funcGraphContractedNodeName = contractedNodeName(foundSelectedNode, subGraphData?.nodes, subGraphData?.edges);
              nodeName = funcGraphContractedNodeName ? funcGraphContractedNodeName.toString() : '';
            } else {
              nodeName = foundSelectedNode.hasOwnProperty('name') ? foundSelectedNode.name : '';
            };

            const updatedNodes = externalGraphData.nodes.map((el: any) => {
              
              if (el.id === externalGraphData.nodeId) {
                el.label = nodeName;
                el.font = {color: "#fff"};
                el.subGraphData = subGraph;
                el.name = nodeName;
                el.shape = "hexagon";
                el.opacity = nodeName === '' ? 0 : 1;
              }
              if (el.labelOfNode === externalGraphData.nodeId) {
                el.label = nodeName;
                el.font = {
                  size: 14,
                  color: "#000000",
                };
                el.opacity = 1;
              }
              return el;
            })
            console.log('updated nodes: ',updatedNodes)
            
            const existingLabelNode = updatedNodes.find(node => node.labelOfNode === externalGraphData.nodeId)
            
            if (!existingLabelNode && nodeName !== '') {
              const labelNode = {
                id: uuidv4(),
                label: nodeName,
                font: {
                  size: 14,
                  color: "#000000",
                },
                shape: "ellipse",        
                x: -20, 
                y: -20,
                isLabelNode: true,
                labelOfNode: foundSelectedNode.id,
                level: foundSelectedNode.level,
              };
              updatedNodes.push(labelNode);
            }

            const externalGraph = JSON.parse(stringifyGraph());
            externalGraph.nodes = updatedNodes;
            externalGraph.edges = externalGraphData?.edges;
            networkRef.current?.setData(externalGraph);
            networkRef.current?.network.moveTo({
              position: { x: viewPosition.x, y: viewPosition.y },
              scale: scale || 1,
              animation: false,
            });
          }
        }
      }
    }
  }, [selectedNodes, buttonMode]);

  useEffect(() => {
    if (buttonMode === "expansion") {
      if (selectedNodes.length === 1) {
        const nodes: TreeNode[] = networkRef.current?.nodes.get();
        const edges: Edge[] = networkRef.current?.edges.get();
        const foundSelectedNode = nodes.find((node: any) => node.id === selectedNodes[0])!;
        
        if (foundSelectedNode.hasOwnProperty('subGraphData')) {
          const subGraphData = JSON.parse(foundSelectedNode.subGraphData);
          const updatedEdges = edges.concat(subGraphData.edges);
          const nodeName = foundSelectedNode.name ? foundSelectedNode.name : '';

          const viewPosition = networkRef.current?.network.getViewPosition()!;
          const scale = networkRef.current?.network.getScale();
          
          // implement offset to the subgraph nodes if it is
          const subgraphNodes = subGraphData.nodes;
          const keyNode = subgraphNodes.find((el: any) => el.id === foundSelectedNode.id);
          if (keyNode.x !== foundSelectedNode.x || keyNode.y !== foundSelectedNode.y) {
            const offsetX = keyNode.x - foundSelectedNode.x;
            const offsetY = keyNode.y - foundSelectedNode.y;

            subgraphNodes.map((el: any) => {
              if (!el.labelOfNode) {
                el.x -= offsetX;
                el.y -= offsetY; 
              }              
            })
          }
          
          const updatedNodes = nodes
            .filter(node => node.id !== foundSelectedNode.id && node.labelOfNode !== foundSelectedNode.id)
            .concat(subgraphNodes)
            .map((el) => {
              if (el.id === foundSelectedNode.id) {
                el.name = nodeName;
              }
              return el;
            });
            
          const expansedGraph = JSON.parse(stringifyGraph());
          expansedGraph.nodes = updatedNodes;
          expansedGraph.edges = updatedEdges;
          networkRef.current?.setData(expansedGraph);
          networkRef.current?.network.moveTo({
            position: { x: viewPosition.x, y: viewPosition.y },
            scale: scale || 1,
            animation: false,
          });
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
  
  const handleCloseButton = () => {
    const currentGraph = stringifyGraph();
    
    if (selectedGraph) {
      // if it is functional graph, check if it hasn't been changed
      if (functionalGraphData.hasOwnProperty(selectedGraph.id!)) {
        const prevData = JSON.parse(selectedGraph.data);
        const nodesLevels = prevData.nodes.map((el: TreeNode) => el.level);
        const maxLevelOfNodes = Math.max(...nodesLevels);

        prevData.nodes.map((el: TreeNode) => {
          if (el.level === maxLevelOfNodes && !el.isLabelNode && functionalGraphData.hasOwnProperty(selectedGraph.id!)) {
            el.subGraphId = selectedGraph.id;
          }
          if (el.opacity === 1 && el.level === maxLevelOfNodes && !el.isLabelNode && functionalGraphData.hasOwnProperty(selectedGraph.id!)) {
            el.isUneditable = true;
          }
          return el;
        })

        if (JSON.stringify(prevData.edges) === JSON.stringify(JSON.parse(currentGraph).edges) 
          && JSON.stringify(prevData.nodes) === JSON.stringify(JSON.parse(currentGraph).nodes)
          && selectedGraph.name === graphName && selectedGraph.note === graphNote) {
            setOpenUtensilModal?.(false);
            setClickCloseButton(false);
            return;
        } else {
          setShowWarningUnsaved(true);
          setClickCloseButton(false);
          return;
        }        
      }
      // if it is non-functional graph, check if it hasn't been changed
      if (!functionalGraphData.hasOwnProperty(selectedGraph.id!)) {
        if (JSON.stringify(JSON.parse(selectedGraph.data).edges) === JSON.stringify(JSON.parse(currentGraph).edges) 
          && JSON.stringify(JSON.parse(selectedGraph.data).nodes) === JSON.stringify(JSON.parse(currentGraph).nodes)
          && selectedGraph.name === graphName && selectedGraph.note === graphNote) {
            setOpenUtensilModal?.(false);
            setClickCloseButton(false);
            return;
        } else {
          setShowWarningUnsaved(true);
          setClickCloseButton(false);
          return;
        }
      }      
    }
    networkRef.current?.nodes.get().length === 0 ? setOpenUtensilModal?.(false) : setShowWarningUnsaved(true);
    setClickCloseButton(false);
  }

  useEffect(() => {
    if (clickCloseButton) {
      handleCloseButton();
    }
  },[clickCloseButton])

  useEffect(() => {
    refreshList();
    initializeUndoTimer();  
    if (!selectedGraph) {
      setGraphName('');
      setGraphNote('');
      setGraphCreator('');
      setGraphId(null);
    }      
  }, []);

  useEffect(() => {
    if (isAddShapeButtonClicked && !isEmptyUtensil) {
      onButton('node');
    }
  }, [isAddShapeButtonClicked, isEmptyUtensil]);

  return (
    <>
      <nav>
        <Navbar 
          page={'utensil'}
          graphs={publicPrivateGraphs}
          trees={trees} 
          hoveredNodes={hoveredNodesRef} 
          selectedNodes={selectedNodesRef} 
          setHoveredChipToVis={setHoveredChipToVis}
          networkRef={networkRef}
          refreshList={refreshList}
          onConfirmReplace={confirmReplaceGraph}
          onConfirmImport={confirmImportGraph}
          onGraphSelected={handleGraphSelected}
          toCloseBar={toCloseBar}
        />
      </nav>
      <main style={{ width: '100%', flex: '1 1 auto' }}>
        <div 
          style={{
            display:'flex',alignItems:'center', height: '100%'
          }}
        >
          <NetworkButtons
            networkRef={networkRef}
            onButton={onButton} // The function to handle button presses lives in Utensil.tsx and is passed down here. This lets us set the button mode programmatically within Utensil.tsx
            undoDisabled={historyListBack.length <= 1}
            redoDisabled={historyListForward.length === 0}
            onUndo={onUndo}
            onRedo={onRedo}
            buttonMode={buttonMode} // this is a React state string of which button is selected. It is passed to the NetworkButtons component which causes the appropriate button to be selected.
          />
          <VisNetwork
            networkRef={networkRef}
            addNodeComplete={addNodeComplete}
            addEdgeComplete={addEdgeComplete}
            historyListBack={historyListBack}
            historyListForward={historyListForward}
            historyListBackRef={historyListBackRef}
            setIsUserDragging={setIsUserDraggingGlobal}
            deleteIfDeleteMode={deleteIfDeleteMode}
            setGraphFromNodesAndEdges={setGraphFromNodesAndEdges}
            addEdgeDirectedOrNot={addEdgeDirectedOrNot}
            buttonModeRef={buttonModeRef}
            hoveredNodes={hoveredNodesRef}
            setHoveredNodesFromNetwork={setHoveredNodesFromNetwork}
            selectedNodes={selectedNodesRef}
            setSelectedNodesFromNetwork={setSelectedNodesFromNetwork}
            graphs={publicPrivateGraphs}
            handleGraphImport={handleGraphImport}
          />
          {isEmptyUtensil &&
            <div 
              style={{position:'absolute', left:'50%', top:'50%', transform: 'translate(-50%, -50%)'}}
            >
              <EmptyUtensilPopUp 
                setIsEmptyUtensil={setIsEmptyUtensil}
                setIsAddShapeButtonClicked={setIsAddShapeButtonClicked}
              />
            </div>
          }
          {/* <ZoomActions />           */}
        </div>
      </main>
    </>
  );
}

export default Utensil;