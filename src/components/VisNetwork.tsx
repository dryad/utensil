import React, { useEffect, useRef, forwardRef } from "react";

import { Node, Edge } from "models";
import { NODE_COLORS } from "constants/colors";
import VisCustomNetwork from "libs/vis-custom-network";
import NodeDialog from "./NodeDialog";
import EdgeDialog from "./EdgeDialog";
import useState from 'react-usestateref';

type INetworkProps = {
  networkRef: any;
  nodes?: Node[];
  edges?: Edge[];
  onSelectNode?: Function;
  addNodeComplete: Function;
  addEdgeComplete: Function;
  historyListBack: string[];
  historyListForward: string[];
  setHistoryListBack: Function;
  setHistoryListForward: Function;
  historyListBackRef: any;
  stringifyGraph: Function;
};

const VisNetwork = ({ networkRef, nodes, edges, onSelectNode, addNodeComplete, addEdgeComplete, historyListBack, historyListForward, setHistoryListBack, setHistoryListForward, historyListBackRef, stringifyGraph }: INetworkProps) => {
    const domRef = useRef<HTMLDivElement>(null);

    const [nodeDialogTitle, setNodeDialogTitle] = useState("");
    const [nodeDialogLabel, setNodeDialogLabel] = useState("");
    const [nodeDialogOpen, setNodeDialogOpen] = useState(false);
    const nodeFnRef = useRef<Function | null>(null);
    const nodeRef = useRef<any>(null);

    const [edgeDialogTitle, setEdgeDialogTitle] = useState("");
    const [edgeDialogDirected, setEdgeDialogDirected] = useState(1);
    const [edgeDialogOpen, setEdgeDialogOpen] = useState(false);
    const edgeFnRef = useRef<Function | null>(null);
    const edgeRef = useRef<any>(null);

    // useEffect(() => {
    //   console.log('new historyListBack', historyListBack);
    // }, [historyListBack]);

    const addHistoryBackNode = () => {
      console.log('addHistoryBackNode');
      addHistoryBack();
    };

    const addHistoryBackEdge = () => {
      console.log('addHistoryBackEdge');
      addHistoryBack();
    };

    const addHistoryBack = () => {
      const newHistory : string = stringifyGraph();
      function setHistory(newHistory: string) {
        setHistoryListBack((state) => [newHistory, ...state]); 

        //re-enable this when undo button does not fire an event, or when we have a better way to handle this
        //historyListForward should be cleared when a change is made that is not the result of undo/redo
        //setHistoryListForward([]);
      }
      
      if (historyListBackRef.current.length == 0) { //if historyListBack is empty - working 
         setHistory("{\"edges\":[],\"nodes\":[]}");
      }

      if (newHistory != '{\"edges\":[],\"nodes\":[]}') {
        //determine if edges were added or deleted
        if (historyListBackRef.current.length > 0) {
          const lastHistory = historyListBackRef.current[0];
          const lastHistoryGraph = JSON.parse(lastHistory);
          const lastHistoryEdges = lastHistoryGraph.edges.length;
          const currentGraph = JSON.parse(newHistory);
          const currentEdges = currentGraph.edges.length;
          if (lastHistoryEdges !== currentEdges) {
            console.log('edges were added or deleted');
            //edges were added or deleted during this update
            //replace first member of historyListBack with newHistory, squashing the last two events
            //because adding an edge or deleting an edge will result in two events
            //TODO: test when multiple edges are deleted
            setHistoryListBack((state) => [newHistory, ...state.slice(1)]);
          }
          else { 
            //only nodes were added, so add graph to history untouched
            setHistory(newHistory); 
          }
        }

      }
  };
    const toggleNodeDialog = () => {
      setNodeDialogOpen(!nodeDialogOpen);
    }

    const handleNodeDialogOk = (label: any) => () => {
      const node = nodeRef.current;
      node.label = label;
      if (!node.level) {
        node.level = 0;
        node.color = NODE_COLORS[node.level];
        node.font = { color: "#fff" };
      }

      networkRef.current?.triggerEvent("node-added", {
        callback: nodeFnRef.current,
        node,
      });
      toggleNodeDialog();
      addNodeComplete(); // causes nodes to be added until button is toggled
    };

    const handleNodeDialogClose = () => {
      nodeFnRef.current(nodeRef.current);
      toggleNodeDialog();
      addNodeComplete(); // causes nodes to be added until button is toggled
    }

    const toggleEdgeDialog = () => setEdgeDialogOpen(!edgeDialogOpen);

    const handleEdgeDialog = (directed: number) => () => {
      const edge = edgeRef.current;

      if (directed) {
        edge["arrows"] = { to: { enabled: true, type: "arrow" } };
      }

      networkRef.current?.triggerEvent("edge-added", {
        callback: edgeFnRef.current,
        edge,
      });

      toggleEdgeDialog();
      addEdgeComplete(); // causes edges to be added until button is toggled
    };

    useEffect(() => {
      if (!networkRef.current && domRef.current) {
        networkRef.current = new VisCustomNetwork(domRef.current);
        
        //Save Undo history when graph is modified
        networkRef.current.nodes.on("*", addHistoryBackNode);
        networkRef.current.edges.on("*", addHistoryBackEdge);

        networkRef.current.on("add-node", ({ node, callback }: any) => {
          nodeFnRef.current = callback;
          nodeRef.current = node;

          setNodeDialogTitle("Add Node");
          setNodeDialogLabel("");
          setNodeDialogOpen(true);
        });

        networkRef.current.on("edit-node", ({ node, callback }: any) => {
          nodeFnRef.current = callback;
          nodeRef.current = node;

          setNodeDialogTitle("Edit Node");
          setNodeDialogLabel(node.label);
          setNodeDialogOpen(true);
        });

        networkRef.current.on("add-edge", ({ edge, callback }: any) => {
          edgeFnRef.current = callback;
          edgeRef.current = edge;

          setEdgeDialogTitle("Add Edge");
          setEdgeDialogDirected(1);
          setEdgeDialogOpen(true);
        });
      }
    }, [networkRef]);

    return (
      <>
        <div ref={domRef} style={{ height: `480px`, width: `100%` }} />
        <NodeDialog
          open={nodeDialogOpen}
          title={nodeDialogTitle}
          label={nodeDialogLabel}
          onClose={handleNodeDialogClose}
          onOk={handleNodeDialogOk}
        />
        <EdgeDialog
          open={edgeDialogOpen}
          title={edgeDialogTitle}
          directed={edgeDialogDirected}
          onClose={toggleEdgeDialog}
          onOk={handleEdgeDialog}
        />
      </>
    );
  }
// );

export default VisNetwork;
