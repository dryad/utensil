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
        enabled: true,
        addNode: this.addNode,
        editNode: this.editNode,
        deleteNode: this.deleteNode,
        addEdge: this.addEdge,
        editEdge: false,
        deleteEdge: false,
      },
      interaction: {
        selectConnectedEdges: false,
      },
      edges: {
        color: "#411811",
        chosen: false,
        width: 3,
      },
      nodes: {
        shape: 'dot',
        size: 10,
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

    this.on("node-added", ({ callback, node }: any) => {
      callback(node);
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
          opacity: 0.5,
          x: (from.x + to.x) / 2,
          y: (from.y + to.y) / 2,
          isLabelNode: true, // but it will set any name regardless if its defined in the object
        };
        this.nodes.add(middle);
        this.edges.add([
          //{ from: from.id, to: id },
          { from: from.id, to: id, eventual: to.id },
          //{ from: id, to: to.id, arrows }, // do we need this?
        ]);
      }
      else {
        const level = from.level + 1;
        const unary = {
          id,
          label: "",
          level,
          color: NODE_COLORS[level],
          opacity: 0.5,
          x: from.x + 50,
          y: from.y - 50,
        }
        this.nodes.add(unary);
        this.edges.add([
          { from: unary.id, to: to.id, arrows },
        ]);
      }
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

      const node = this.nodes.get(nodeId);
      for (const connectedNodeId of connectedNodeIds) {
        const connectedNode = this.nodes.get(connectedNodeId);
        if (
          connectedNode.level > node.level &&
          !data.nodes.includes(connectedNodeId)
        ) {
          data.nodes.push(connectedNodeId);
          queue.push(connectedNodeId);
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
