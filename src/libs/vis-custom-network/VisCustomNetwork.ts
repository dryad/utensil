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

    this.on("node-added", ({ callback, node }: any) => {
      callback(node);
    });

    this.on("edge-added", ({ callback, edge }: any) => {
      const from = this.nodes.get(edge.from);
      const to = this.nodes.get(edge.to);
      const { arrows } = edge;

      const id = uuidv4();
      const level = Math.max(from.level, to.level) + 1;
      const middle = {
        id,
        label: "",
        level,
        color: NODE_COLORS[level],
        opacity: 0.5,
        x: (from.x + to.x) / 2,
        y: (from.y + to.y) / 2
      };

      this.nodes.add(middle);

      this.edges.add([
        //{ from: from.id, to: id },
        { from: from.id, to: id, eventual: to.id },
        { from: id, to: to.id, arrows },
      ]);
    });
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
