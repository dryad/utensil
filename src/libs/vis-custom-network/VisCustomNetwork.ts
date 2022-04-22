import { v4 as uuidv4 } from "uuid";
import { Network } from "vis-network";
import { DataSet } from "vis-data";

import { NODE_COLORS } from "constants/colors";
import { truncateSync } from "fs";

export default class VisCustomNetwork extends EventTarget {
  dom: HTMLElement;
  network: Network;
  nodes: DataSet;
  edges: DataSet;
  options: any;

  constructor(dom: HTMLElement) {
    super();
    this.dom = dom;
    this.nodes = new DataSet();
    this.edges = new DataSet();
    this.options = {
      manipulation: {
        enabled: false,
        addNode: this.addNode,
        editNode: this.editNode,
        deleteNode: this.deleteNode,
        addEdge: this.addEdge,
        editEdge: false,
        deleteEdge: false,
      },
      interaction: {
        selectConnectedEdges: false,
        selectable: true,
      },
      edges: {
        color: "#411811",
        chosen: false,
        width: 3,
      },
      nodes: {
        shape: 'dot',
        size: 10,
        opacity: 1.0,
        borderWidth: 3,
        borderWidthSelected: 5,
      },
      physics: {
        enabled: false,
      },
    };
    this.network = new Network(
      dom,
      { nodes: this.nodes, edges: this.edges },
      this.options
    );

    this.network.on("dragStart", ({params}) => {
      this.triggerEvent("drag-start", {});
    });
    this.network.on("dragEnd", ({params}) => {
      this.triggerEvent("drag-end", {});
    });
    this.network.on("controlNodeDragEnd", ({params}) => { // This extra vis event is needed because dragging an "add edge" control point did not trigger the dragEnd event
      this.triggerEvent("drag-end", {});
    });
    
    var lastClick = 0;
    this.network.on("click", params => {
      var d = new Date();
      var t = d.getTime();
      if(t - lastClick > 200) {
        if (params.nodes.length > 0) {  //if we clicked on any node
          for (const nodeId of params.nodes) {  //loop through all nodes that were clicked
            const node = this.nodes.get(nodeId); //get the node by ID from the network
            if (node && node.isLabelNode) { //if the node exists and is a labelNode
              //disabled editing labelNode on click, so it wont edit on click & hold, only on double click below.
              // const labelOfNode = this.nodes.get(node.labelOfNode); //get the node that this labelNode is a label of
              // this.editNode(labelOfNode, undefined); //pop up the edit box for that node
            }
            if (node && !node.isLabelNode) {
              this.triggerEvent("click-node", node); // send an event to VisNetwork, where we can pass it along up to App.tsx to delete the node if deleteMode is active.
            }
          }
        }
      }
      lastClick = t;
    })
    this.network.on("doubleClick", params => {
      if (params.nodes.length > 0) {  //if we double clicked on any node
        for (const nodeId of params.nodes) {  //loop through all nodes that were clicked
          let node = this.nodes.get(nodeId); //get the node by ID from the network
          if (node && !node.isLabelNode) { //if the node exists and is not a labelNode
            this.triggerEvent("double-click-node", { node }); // send an event to VisNetwork, to open the node's edit box if "pan" mode is active (hand tool)
          }
          if (node && node.isLabelNode) { //if the node exists and is a labelNode, act like we double clicked the node itself. (this is to edit the label)
            node = this.nodes.get(node.labelOfNode); //get the node that this labelNode is a label of
            this.triggerEvent("double-click-node", { node }); // send an event to VisNetwork, to open the node's edit box if "pan" mode is active (hand tool)
          }
        }
      }
    })

    // NOTE: Anything added here should also be added to the setData function below, so that it will work after a graph is loaded or undo/redo is performed.
    this.on("node-added", ({ callback, node }: any) => {
      //handle crash when double clicking in add node mode - only add node if it doesn't already exist
      if (this.nodes.get().find((n: any) => n.id === node.id) === undefined) {
        //handle create or update node before create or update labelNode
        if (window.ethereum && window.ethereum.selectedAddress) {
          console.log('creating node, assigning address', ethereum.selectedAddress);
          node.address = ethereum.selectedAddress;
        };
        callback(node);
      }
      //create labelNode if it doesn't exist - otherwise update it
      const existingLabelNode = this.nodes.get().find((n: any) => n.labelOfNode === node.id)
      if (existingLabelNode) {
        //node already has a label, update it.
        existingLabelNode.label = node.label;
        this.nodes.update(existingLabelNode);
      }
      else {
        //node does not have label, create it.
        const labelNode = {
          id: uuidv4(),
          label: node.label,
          font: {
            size: 14,
            color: "#000000",
          },
          shape: "ellipse",        
          x: -20, //labelNode position is an offset from node
          y: -20,
          isLabelNode: true,
          labelOfNode: node.id,
          level: node.level,
        };
        if (window.ethereum && window.ethereum.selectedAddress) {
          console.log('creating label node, assigning address', ethereum.selectedAddress);
          labelNode.address = ethereum.selectedAddress;
        };
        this.nodes.add(labelNode);

      }

    });

    this.on("edge-added", ({ callback, edge }: any) => {
      const from = this.nodes.get(edge.from);
      const to = this.nodes.get(edge.to);
      const { arrows } = edge;

      const id = uuidv4();

      if (from !== to) { // if not self-loop
        const level = Math.max(from.level, to.level) + 1;
        const middle = {
          id,
          label: "",
          level,
          color: NODE_COLORS[level],
          opacity: 0,
          x: (from.x + to.x) / 2,
          y: (from.y + to.y) / 2,
        };
        if (window.ethereum && window.ethereum.selectedAddress) {
          console.log('creating middle node, assigning address', ethereum.selectedAddress);
          middle.address = ethereum.selectedAddress;
        };
        this.nodes.add(middle);
        this.edges.add([
          //create the three-part edge, from -> to -> eventual
          //set whether the edge is directed or not, from the original edge that vis tries to create
          { from: from.id, to: id, eventual: to.id, directed: edge.directed},
        ]);
      }
      // Unary edges are disabled, uncomment below to enable
      // else {
      //   const level = from.level + 1;
      //   const unary = {
      //     id,
      //     label: "",
      //     level,
      //     color: NODE_COLORS[level],
      //     opacity: 1.0,
      //     x: from.x + 50,
      //     y: from.y - 50,
      //   }
      //   this.nodes.add(unary);
      //   this.edges.add([
      //     { from: unary.id, to: to.id, arrows },
      //   ]);
      // }
    });
    this.network.enableEditMode(); // enable edit mode on new network;
  }


  setData = (data: any): void => {
    this.nodes.clear();
    this.edges.clear();

    this.nodes.add(data.nodes);
    this.edges.add(data.edges);
    this.network = new Network(
      this.dom,
      { nodes: this.nodes, edges: this.edges },
      this.options
    );

    data.nodes.forEach((node) => {
      this.network.moveNode(node.id, node.x, node.y);
    });

    //this is duplicated code from the constructor, but it's necessary to make the events work after a graph is loaded
    //or if Undo/Redo is used
    this.network.on("dragStart", ({params}) => {
      this.triggerEvent("drag-start", {});
    });
    this.network.on("dragEnd", ({params}) => {
      this.triggerEvent("drag-end", {});
    });
    this.network.on("controlNodeDragEnd", ({params}) => { // This extra vis event is needed because dragging an "add edge" control point did not trigger the dragEnd event
      this.triggerEvent("drag-end", {});
    });
    //this is duplicated code from the constructor, but it's necessary to enable edit mode after a graph is loaded
    //or if Undo/Redo is used
    this.network.enableEditMode(); // enable edit mode on network that has just been loaded;
    
    //this is also duplicated code from the constructor, but it's necessary to make the delete tool work after a graph is loaded
    var lastClick = 0;
    
    this.network.on("click", params => {
      var d = new Date();
      var t = d.getTime();
      if(t - lastClick > 200) {
        if (params.nodes.length > 0) {  //if we clicked on any node
          for (const nodeId of params.nodes) {  //loop through all nodes that were clicked
            const node = this.nodes.get(nodeId); //get the node by ID from the network
            if (node && node.isLabelNode) { //if the node exists and is a labelNode
              //disabled editing labelNode on click, so it wont edit on click & hold, only on double click below.
              // const labelOfNode = this.nodes.get(node.labelOfNode); //get the node that this labelNode is a label of
              // this.editNode(labelOfNode, undefined); //pop up the edit box for that node
            }
            if (node && !node.isLabelNode) {
              this.triggerEvent("click-node", node); // send an event to VisNetwork, where we can pass it along up to App.tsx to delete the node if deleteMode is active.
            }
          }
        }
      }
      lastClick = t;
    })

    //this is also duplicated code from the constructor, but it's necessary to make double clicking a node work after a graph is loaded
    this.network.on("doubleClick", params => {
      if (params.nodes.length > 0) {  //if we double clicked on any node
        for (const nodeId of params.nodes) {  //loop through all nodes that were clicked
          let node = this.nodes.get(nodeId); //get the node by ID from the network
          if (node && !node.isLabelNode) { //if the node exists and is not a labelNode
            this.triggerEvent("double-click-node", { node }); // send an event to VisNetwork, to open the node's edit box if "pan" mode is active (hand tool)
          }
          if (node && node.isLabelNode) { //if the node exists and is a labelNode, act like we double clicked the node itself. (this is to edit the label)
            node = this.nodes.get(node.labelOfNode); //get the node that this labelNode is a label of
            this.triggerEvent("double-click-node", { node }); // send an event to VisNetwork, to open the node's edit box if "pan" mode is active (hand tool)
          }
        }
      }
    })
  };

  addNode = (node: any, callback: any): void => {
    this.triggerEvent("add-node", { node, callback });
  };

  editNode = (node: any, callback: any): void => {
    this.triggerEvent("edit-node", { node, callback });
  };

  deleteNode = (data: any, callback: any): void => {
    const queue = [...data.nodes];
    while (queue.length) {
      const nodeId = queue.shift();
      const connectedNodeIds = this.network.getConnectedNodes(
        nodeId
      ) as string[];
      //add to the deletion queue: the labelNode
      const labelNode = this.nodes.get().find((n: any) => n.labelOfNode === nodeId);
      if (labelNode) {
        data.nodes.push(labelNode.id);
        queue.push(labelNode.id);
      }
      const node = this.nodes.get(nodeId);
      for (const connectedNodeId of connectedNodeIds) {
        const connectedNode = this.nodes.get(connectedNodeId);
        if (
          connectedNode.level > node.level &&
          !data.nodes.includes(connectedNodeId)
        ) {   
          data.nodes.push(connectedNodeId);
          queue.push(connectedNodeId);
          //add to the deletion queue: the labelNode of any connected nodes flagged for deletion
          const labelNode = this.nodes.get().find((n: any) => n.labelOfNode === connectedNodeId);
          if (labelNode) {
            data.nodes.push(labelNode.id);
            queue.push(labelNode.id);
          }
        }
      }
    }
    callback(data);
  };

  addEdge = (edge: any, callback: any): void => {
    this.triggerEvent("add-edge", { edge, callback });
  };
  
  /***************************
   * Custom Event Management *
   ***************************/
  on = (event: string, handler: Function): void => {
    this.addEventListener(event, (e: any) => {
      if (handler) {
        handler(e.detail);
      }
    });
  };

  triggerEvent = (name: string, payload: object = {}): void => {
    this.dispatchEvent(new CustomEvent(name, { detail: payload }));
  };
}
