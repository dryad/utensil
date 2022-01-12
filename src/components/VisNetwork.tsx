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
};

const VisNetwork = ({ networkRef, nodes, edges, onSelectNode, addNodeComplete, addEdgeComplete, historyListBack, historyListForward, historyListBackRef, stringifyGraph }: INetworkProps) => {
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
