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
  historyListBackRef: any;
  stringifyGraph: Function;
  setIsUserDragging: Function;
  deleteIfDeleteMode: Function;
  addEdgeDirectedOrNot: Function;
  buttonModeRef: any;
};

const VisNetwork = ({ networkRef, nodes, edges, onSelectNode, addNodeComplete, addEdgeComplete, historyListBack, historyListForward, historyListBackRef, stringifyGraph, setIsUserDragging, deleteIfDeleteMode, addEdgeDirectedOrNot, buttonModeRef }: INetworkProps) => {
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
      if (nodeDialogTitle !== "Edit Node") {
        addNodeComplete(); // allows nodes to be added until button is turned off
      }
      
    };

    const handleNodeDialogClose = () => {
      //nodeFnRef.current(nodeRef.current); // with this disabled, it will not create a blank node when the dialog is closed
      toggleNodeDialog();
      if (nodeDialogTitle !== "Edit Node") {
        addNodeComplete(); // allows nodes to be added until button is turned off
      }
    };

    const handleEdgeCreated = () => {
      const edge = edgeRef.current;
      addEdgeDirectedOrNot(edge, edgeFnRef);

      addEdgeComplete(); // allows edges to be added until button is turned off
    };

    useEffect(() => {
      if (!networkRef.current && domRef.current) {
        networkRef.current = new VisCustomNetwork(domRef.current);

        //events received from VisCustomNetwork.ts when user starts or stops dragging
        //updates React state so we can disable undo/redo timer functionality during drag.
        networkRef.current.on("drag-start", (event: any) => {
          setIsUserDragging(true);
        });
        networkRef.current.on("drag-end", (event: any) => {
          setIsUserDragging(false);
        });

        networkRef.current.on("add-node", ({ node, callback }: any) => {
          // old code here would open the dialog box, where the handleNodeDialogOk function would eventually be called
          // but we want to be able to add nodes without opening the dialog box
          // nodeFnRef.current = callback;
          // nodeRef.current = node;

          // setNodeDialogTitle("Add Node");
          // setNodeDialogLabel("");
          // setNodeDialogOpen(true);
          //const node = nodeRef.current;
          //node.label = label;
          
          // new code runs similar code to handleNodeDialogOk, but just creates a node with default parameters
          nodeFnRef.current = callback;
          nodeRef.current = node;
          if (!node.level) {
            node.level = 0;
            node.color = NODE_COLORS[node.level];
            node.font = { color: "#fff" };
          }
          node.label = "";          
          networkRef.current?.triggerEvent("node-added", {
            callback: nodeFnRef.current,
            node,
          });

          addNodeComplete(); // allows nodes to be added until button is turned off
        });


        networkRef.current.on("edit-node", ({ node, callback }: any) => {
          editNodeFromEvent(node, callback);
        });

        networkRef.current.on("add-edge", ({ edge, callback }: any) => {
          edgeFnRef.current = callback;
          edgeRef.current = edge;

          handleEdgeCreated();
        });
      }
      const editNodeFromEvent = (node, callback) => {

        if (node.node) {
          node = node.node;
        }
        //when coming from a labelNode click, we are editing the parent node, but callback is undefined
        if (callback !== undefined) {
          nodeFnRef.current = callback;
        }
          
        nodeRef.current = node;

        setNodeDialogTitle("Edit Node");
        setNodeDialogLabel(node.label);
        setNodeDialogOpen(true);
      }

      networkRef.current.on("click-node", node => {
        if (!node.isLabelNode) {
          deleteIfDeleteMode(); // run callback function to App.tsx, where it can check if delete mode is on. The selected (last clicked) node will be deleted if delete mode is on.
        }
      })

      networkRef.current.on("double-click-node", node => {
        if (!node.isLabelNode) {
          console.log('double click event from VisNetwork.ts', buttonModeRef.current);
          if (buttonModeRef.current == "pan") {
            editNodeFromEvent(node, undefined);
          }          
        }
      })
    }, [networkRef]);

    return (
      <>
        <div ref={domRef} style={{ height: `480px`, width: `100%` }} />
        <NodeDialog
          open={nodeDialogOpen}
          title={nodeDialogTitle}
          nodeLabel={nodeDialogLabel}
          onClose={handleNodeDialogClose}
          onOk={handleNodeDialogOk}
          setNodeLabel={setNodeDialogLabel}
        />
      </>
    );
  }
// );

export default VisNetwork;
