import React, { useEffect, useRef, memo, forwardRef } from "react";
import { Node, Edge } from "models";
import { NODE_COLORS } from "constants/colors";
import VisCustomNetwork from "libs/vis-custom-network";
import NodeDialog from "./NodeDialog";
import EdgeDialog from "./EdgeDialog";
import useState from 'react-usestateref';
import { v4 as uuidv4 } from "uuid";

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
  setGraphFromNodesAndEdges: Function;
  addEdgeDirectedOrNot: Function;
  buttonModeRef: any;
  hoveredNodes: any;
  setHoveredNodesFromNetwork: Function;
  selectedNodes: any;
  setSelectedNodesFromNetwork: Function;
  graphs: any;
  handleGraphImport: Function;
};

const VisNetwork = ({ networkRef, nodes, edges, onSelectNode, addNodeComplete, addEdgeComplete, historyListBack, historyListForward, historyListBackRef, stringifyGraph, setIsUserDragging, deleteIfDeleteMode, setGraphFromNodesAndEdges, addEdgeDirectedOrNot, buttonModeRef, hoveredNodes, setHoveredNodesFromNetwork, selectedNodes, setSelectedNodesFromNetwork, graphs, handleGraphImport }: INetworkProps) => {
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
      if (node.hasOwnProperty('name') && node.hasOwnProperty('subGraphData')) {
        node.name = label;
      }

      if (node.label && node.label.length > 0) {
        node.opacity = 1.0;
      }
      else {
        node.opacity = 0;
      }
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

      //set graph from nodes and edges, this is needed to update the opacity of the nodes
      const existingGraph = JSON.parse(stringifyGraph());
      setGraphFromNodesAndEdges(existingGraph.nodes, existingGraph.edges);
      networkRef.current?.setData(existingGraph);

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
        networkRef.current.on("drag-end", async (event: any) => {
          setIsUserDragging(false);
          const selectedNodes = networkRef.current?.network.getSelectedNodes();
          
          // if only one node was dragged, check if it is close to another node, ignoring labelnodes
          if (selectedNodes.length === 1) {
            const selectedNode = networkRef.current?.network.body.nodes[selectedNodes[0]];
            if (selectedNode) {
              if (selectedNode.isLabelNode) { return; }

              // find other nodes that are within a certain distance of the dropped node
              const nodesWithinDistance = Object.values(networkRef.current?.network.body.nodes).filter((node: any) => {
                if (node.isLabelNode) { return false; }
                const distance = Math.sqrt(Math.pow(node.x - selectedNode.x, 2) + Math.pow(node.y - selectedNode.y, 2));
                return distance < 5;
              });

              // If there are only two nodes within distance, we can merge them
              // also we will check if the labels are the same
              if (nodesWithinDistance.length === 2) {  
                // console.log('distance between the two nodes: ', Math.sqrt(Math.pow(nodesWithinDistance[0].x - nodesWithinDistance[1].x, 2) + Math.pow(nodesWithinDistance[0].y - nodesWithinDistance[1].y, 2)));
                
                //get node by id from networkRef.current?.network.body.data.nodes.get()
                let mergeNodes = [networkRef.current?.network.body.data.nodes.get(nodesWithinDistance[0].id), networkRef.current?.network.body.data.nodes.get(nodesWithinDistance[1].id)];
                mergeNodes.sort(function (a, b) {
                  return a.level - b.level;
                });
                const mergeNode1 = mergeNodes[0]; // the node with the lower level
                const mergeNode2 = mergeNodes[1];

                if (mergeNode1 && mergeNode2) {

                  //Recursively walk edges to determine if there would be a loop.
                  let loop_found = false;
                  const check_for_loop = (node1_id: string, node2_id: string) : boolean => {
                    if (loop_found) { return true; } // if we already found a loop, don't keep checking
                    
                    // console.log('LOOP RULE: evaluating', node1_id, '->', node2_id);
                    //get all edges where node1_id is the 'from' or 'eventual'
                    const edges_from_eventual_node1 = networkRef.current?.network.body.data.edges.get({
                      filter: function (edge: any) {
                        return edge.from === node1_id || edge.eventual === node1_id;
                      }
                    });
                    // console.log('LOOP RULE: edges_from_eventual_node1: ', edges_from_eventual_node1);

                    // check if node2_id is in the 'to' for any of the edges
                    const was_node2_id_found = edges_from_eventual_node1.some((edge: any) => {
                      return edge.to === node2_id;
                    }
                    );

                    // console.log('LOOP RULE: was_node2_id_found: ', was_node2_id_found);
                    if (was_node2_id_found) {
                      loop_found = true;
                      return true; // node2_id was found in the 'to' of any of the edges, stop recursing this thread
                    }
                    
                    //node 1 will be the 'to' of the previously walked edges
                    //node 2 will remain the same
                    //recurse
                    for (const edge of edges_from_eventual_node1) {
                      node1_id = edge.to;
                      // console.log('LOOP RULE: checking from node: ', node1_id);
                      check_for_loop(node1_id, node2_id);
                    }
                    return loop_found
                  };

                  // ---------------------- RULES FOR MERGING ----------------------
                  // determine if the labels can be merged based on the following rules:
                  // 1. if neither of the nodes have level 0, stop the merge
                  // 2. if the labels are not the same, and neither one is blank, stop the merge
                  // 3. if a loop is detected, stop the merge
                  const are_nodes_mergable = async function () {

                    if (mergeNode1.level !== 0 && mergeNode2.level !== 0) {
                      console.log('RULE 1 not passed: neither node has level 0');
                      return false;
                    }

                    if (mergeNode1.label !== mergeNode2.label) {
                      if (mergeNode1.label !== "" && mergeNode2.label !== "") {
                        console.log('RULE 2 not passed: labels are not the same and neither is blank');
                        return false;
                      }
                    }
                    
                    if (await check_for_loop(mergeNode1.id, mergeNode2.id)) {
                      console.log('RULE 3 not passed: loop detected');
                      return false;
                    }

                    return true;
                  }
                  
                  if (await are_nodes_mergable()) {
                    console.log('Merging nodes: ', mergeNode1.id, mergeNode2.id);
                    
                    // get all nodes & edges
                    const nodes = networkRef.current?.network.body.data.nodes.get();
                    const edges = networkRef.current?.network.body.data.edges.get();
                    const oldEdges = edges; // for analyzing differences in edges when fixing levels after merging

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
                    
                    // Filter the list of nodes to not include the first node and its labelNode
                    let newNodes = [];
                    for (const node of nodes) {
                      if (node.id !== mergeNode1.id && node.labelOfNode !== mergeNode1.id) {
                          newNodes.push(node);
                      }                      
                    }

                    // Set the second node's level and opacity to be the max of the two nodes' levels and opacity
                    mergeNode2.level = Math.max(mergeNode1.level, mergeNode2.level);
                    mergeNode2.opacity = Math.max(mergeNode1.opacity, mergeNode2.opacity);
                    // Set the color based on the level
                    mergeNode2.color = NODE_COLORS[mergeNode2.level];

                    // if the label of mergeNode2 is empty, set it to the label of the mergeNode1
                    if (mergeNode2.label === "") {
                      mergeNode2.label = mergeNode1.label;
                    }

                    // find the labelNode of mergeNode2 and if it exists, update it as well
                    const labelNode = nodes.find((node: any) => node.labelOfNode === mergeNode2.id);
                    if (labelNode) {
                      labelNode.label = mergeNode2.label;
                      newNodes.splice(newNodes.findIndex((node: any) => node.id === labelNode.id), 1, labelNode);
                    }
                    else {  // if the labelNode doesn't exist
                      if (mergeNode2.label !== "") { // and if the label is not empty, create a new labelNode
                        const labelNode = {
                          id: uuidv4(),
                          label: mergeNode2.label,
                          font: {
                            size: 14,
                            color: "#000000",
                          },
                          shape: "ellipse",
                          x: -20, //labelNode position is an offset from node
                          y: -20,
                          isLabelNode: true,
                          labelOfNode: mergeNode2.id,
                          level: mergeNode2.level,
                        };
                        newNodes.push(labelNode);
                      }
                    }

                    // in the output of the new nodes data, update the second node by id, because we possibly changed its level and color
                    newNodes.splice(newNodes.findIndex((node: any) => node.id === mergeNode2.id), 1, mergeNode2);

                    // ******** START FIX LEVEL WALK ********
                    const is_fix_levels_needed = (node1_id: string, node2_id: string) : boolean => {

                      if (mergeNode1.level === 0 && mergeNode2.level === 0) { return false; } // if both nodes are level 0, don't start walk
                      // console.log('FIX LEVELS: evaluating', mergeNode1.id, '->', mergeNode2.id);

                      // check if one of the nodes was a 'to' node in the old data.
                      const was_node1_id_to= oldEdges.some(
                        (edge: any) => {
                          if (edge.to === node1_id) {
                            // console.log('FIX LEVELS: found node1 in the \'to\' of old edge: ', edge.id);
                            return true;
                          }
                          return false;
                        }
                      );
                      const was_node2_id_to = oldEdges.some(
                        (edge: any) => {
                          if (edge.to === node2_id) {
                            // console.log('FIX LEVELS: found node2 in the \'to\' of old edge: ', edge.id);
                            return true;
                          }
                          return false;
                        }
                      );

                      if (was_node1_id_to || was_node2_id_to) {
                        // console.log('FIX LEVELS: one of the nodes was a \'to\' node in the old data, and is now a \'from\' or \'eventual\' in the new data');
                        const is_node1_id_from_eventual = edges.some(
                          (edge: any) => {
                            if (edge.from === node1_id || edge.eventual === node1_id) {
                              // console.log('FIX LEVELS: found node1 in the \'from\' or \'eventual\' of old edge: ', edge.id);
                              return true;
                            }
                            return false;
                          }
                        );
                        const is_node2_id_from_eventual = edges.some(
                          (edge: any) => {
                            if (edge.from === node2_id || edge.eventual === node2_id) {
                              // console.log('FIX LEVELS: found node2 in the \'to\' or \'eventual\' of old edge: ', edge.id);
                              return true;
                            }
                            return false;
                          }
                        );
                        if (is_node1_id_from_eventual || is_node2_id_from_eventual) {
                          // console.log('FIX LEVELS: at least one of the nodes is a \'from\' or \'eventual\' node in the new data, and was a \'to\' in the old data');
                          // start walk
                          return true;
                        }
                        return false;
                      }
                    };
                    let edges_walked : string[] = [];
                    // recursively fix levels
                    const fix_levels = (node_id: string) : boolean => {
                      const node = newNodes.find((node: any) => node.id === node_id);
                      
                      // find any edges containing this node as the 'from' or 'eventual' in the new data
                      const edges_from_eventual_node = edges.filter(
                        (edge: any) => {
                          return edge.from === node_id || edge.eventual === node_id;
                        }
                      );
                      // look at the 'to' of each edge found
                      for (const edge of edges_from_eventual_node) {
                        if (edges_walked.includes(edge.id)) { continue; } // don't check the same edge twice
                        // get the node with the 'to' id
                        const node_to = newNodes.find((node: any) => node.id === edge.to);
                        // setting the level if wrong, and updating the color
                        if (node_to == undefined) {
                          console.log("BUG: node_to is undefined. There may be an extra edge in the graph. Missing node ID: ", edge.to);
                        }
                        if (node_to.level < node.level + 1) { // will not allow setting the level lower. (node_to.level !== node.level + 1) was allowing a higher level to be decreased if connected to a lower level node on one side.
                          // console.log('FIX LEVELS: node_to.level <= node.level: ', node_to.level, '<=', node.level);
                          node_to.level = node.level + 1;
                          node_to.color = NODE_COLORS[node_to.level];
                          // console.log('FIX LEVELS: node_to.level: ', node_to.level);
                        }
                        edges_walked.push(edge.id); // add the edge to the walked edges
                        // recurse
                        fix_levels(node_to.id);
                      
                      }
                    };
                    // ******** END FIX LEVEL WALK ********
                    if (is_fix_levels_needed(mergeNode1.id, mergeNode2.id)) {
                      await fix_levels(mergeNode2.id); // mergeNode2.id is the correct starting point, because that is the ID that remains for two merged nodes.
                    }

                    // tell App.jsx to update the nodes and edges
                    await setGraphFromNodesAndEdges(newNodes, edges);

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
            node.opacity = 0;
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
          deleteIfDeleteMode(); // run callback function to Utensil.tsx, where it can check if delete mode is on. The selected (last clicked) node will be deleted if delete mode is on.
        }
      });

      networkRef.current.on("double-click-node", node => {
        if (!node.isLabelNode) {
          editNodeFromEvent(node, undefined);  
        }
      });

      networkRef.current.on("hovered-nodes", nodeIds => {
        // console.log('hovered nodes received: ', nodeIds.length);
        // console.log(Object.values(nodeIds));
        setHoveredNodesFromNetwork(Object.values(nodeIds)); // run callback function to Utensil.tsx, will save the hovered node IDs to state  
      });

      networkRef.current.on("selected-nodes", nodeIds => {
        console.log('selected nodes received: ', nodeIds.length);
        console.log(Object.values(nodeIds));
        setSelectedNodesFromNetwork(Object.values(nodeIds)); // run callback function to Utensil.tsx, will save the hovered node IDs to state  
      });


      networkRef.current.on("hold", params => {
        if (buttonModeRef.current === "pan") {
          console.log('hold event received', params);
          networkRef.current?.network.setSelection({ nodes: hoveredNodes.current });
        }
      });

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
          graphs={graphs}
          handleGraphImport={handleGraphImport}
        />
      </>
    );
  }

export default memo(VisNetwork);
// export default VisNetwork;
