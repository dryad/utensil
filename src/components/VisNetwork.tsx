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
  setSnappedNodesAndEdges: Function;
  addEdgeDirectedOrNot: Function;
  buttonModeRef: any;
};

const VisNetwork = ({ networkRef, nodes, edges, onSelectNode, addNodeComplete, addEdgeComplete, historyListBack, historyListForward, historyListBackRef, stringifyGraph, setIsUserDragging, deleteIfDeleteMode, setSnappedNodesAndEdges, addEdgeDirectedOrNot, buttonModeRef }: INetworkProps) => {
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
          const selectedNodes = networkRef.current?.network.getSelectedNodes();
          console.log('selectedNodes on drag-end', selectedNodes);
          
          // if only one node was dragged, check if it is close to another node, ignoring labelnodes
          if (selectedNodes.length === 1) {
            const selectedNode = networkRef.current?.network.body.nodes[selectedNodes[0]];
            if (selectedNode) {
              if (selectedNode.isLabelNode) { return; }
              console.log('x/y of dropped node:', selectedNode.x, selectedNode.y);

              // find other nodes that are within a certain distance of the dropped node
              const nodesWithinDistance = Object.values(networkRef.current?.network.body.nodes).filter((node: any) => {
                if (node.isLabelNode) { return false; }
                const distance = Math.sqrt(Math.pow(node.x - selectedNode.x, 2) + Math.pow(node.y - selectedNode.y, 2));
                return distance < 5;
              });
              console.log('nodesWithinDistance', nodesWithinDistance);

              // If there are only two nodes within distance, we can merge them
              // also we will check if the labels are the same
              if (nodesWithinDistance.length === 2) {  
                console.log('distance between the two nodes: ', Math.sqrt(Math.pow(nodesWithinDistance[0].x - nodesWithinDistance[1].x, 2) + Math.pow(nodesWithinDistance[0].y - nodesWithinDistance[1].y, 2)));
                
                //get node by id from networkRef.current?.network.body.data.nodes.get()
                const mergeNode1 = networkRef.current?.network.body.data.nodes.get(nodesWithinDistance[0].id);
                const mergeNode2 = networkRef.current?.network.body.data.nodes.get(nodesWithinDistance[1].id);

                if (mergeNode1 && mergeNode2) {
                  console.log('node 1 label: ', mergeNode1.label);
                  console.log('node 2 label: ', mergeNode2.label);

                  if (mergeNode1.label === mergeNode2.label) {
                    console.log('Merging nodes: ', mergeNode1.id, mergeNode2.id);
                    
                    // get all nodes & edges
                    const nodes = networkRef.current?.network.body.data.nodes.get();
                    const edges = networkRef.current?.network.body.data.edges.get();
                    
                    for (const edge of edges) {
                      //update from, to and eventual fields to point to the new node ids

                      if (edge.from === mergeNode1.id) {
                        edge.from = mergeNode2.id;
                      }
                      if (edge.to === mergeNode1.id) {
                        edge.to = mergeNode2.id;
                      }
                      if (edge.eventual === mergeNode1.id) {
                        edge.eventual = mergeNode2.id;
                      }
                    }
                    // Filter the list of nodes to not include the merged node and its labelNode
                    const newNodes = Object.values(nodes).filter((node: any) => node.id !== mergeNode1.id && node.labelOfNode !== mergeNode1.id);
                    setSnappedNodesAndEdges(newNodes, edges);
                  }
                }
              }  
            }
          }
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
        if (buttonModeRef.current !== "pan") { //only allow editing nodes when in pan mode
          return;
        }

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
          editNodeFromEvent(node, undefined);  
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
