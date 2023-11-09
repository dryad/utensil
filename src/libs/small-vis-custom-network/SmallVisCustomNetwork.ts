import { Network } from "vis-network";
import { DataSet } from "vis-data";

export default class SmallVisCustomNetwork extends EventTarget {
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
        editEdge: false,
        deleteEdge: false,
      },
      interaction: {
        selectConnectedEdges: false,
        selectable: false,
        hover: false,
        hoverConnectedEdges: false,
        "dragNodes": false,
        "dragView": false,
        "keyboard": false,
        "zoomView": false        
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
  };
}
