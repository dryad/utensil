import React, { useState, useEffect, useRef, forwardRef } from "react";

import { Node, Edge } from "models";
import { NODE_COLORS } from "constants/colors";
import VisCustomNetwork from "libs/vis-custom-network";
import NodeDialog from "./NodeDialog";
import EdgeDialog from "./EdgeDialog";

type INetworkProps = {
  ref: any;
  nodes?: Node[];
  edges?: Edge[];
  onSelectNode?: Function;
};

const VisNetwork: React.FC<INetworkProps> = forwardRef(
  (props: INetworkProps, ref: any) => {
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

    const toggleNodeDialog = () => setNodeDialogOpen(!nodeDialogOpen);

    const handleNodeDialogOk = (label: any) => () => {
      const node = nodeRef.current;
      node.label = label;
      if (!node.level) {
        node.level = 0;
        node.color = NODE_COLORS[node.level];
        node.font = { color: "#fff" };
      }

      ref.current?.triggerEvent("node-added", {
        callback: nodeFnRef.current,
        node,
      });

      toggleNodeDialog();
    };

    const handleNodeDialogClose = () => {
      nodeFnRef.current(nodeRef.current);
      toggleNodeDialog();
    }

    const toggleEdgeDialog = () => setEdgeDialogOpen(!edgeDialogOpen);

    const handleEdgeDialog = (directed: number) => () => {
      const edge = edgeRef.current;

      if (directed) {
        edge["arrows"] = { to: { enabled: true, type: "arrow" } };
      }

      ref.current?.triggerEvent("edge-added", {
        callback: edgeFnRef.current,
        edge,
      });

      toggleEdgeDialog();
    };

    useEffect(() => {
      if (!ref.current && domRef.current) {
        ref.current = new VisCustomNetwork(domRef.current);

        ref.current.on("add-node", ({ node, callback }: any) => {
          nodeFnRef.current = callback;
          nodeRef.current = node;

          setNodeDialogTitle("Add Node");
          setNodeDialogLabel("");
          setNodeDialogOpen(true);
        });

        ref.current.on("edit-node", ({ node, callback }: any) => {
          nodeFnRef.current = callback;
          nodeRef.current = node;

          setNodeDialogTitle("Edit Node");
          setNodeDialogLabel(node.label);
          setNodeDialogOpen(true);
        });

        ref.current.on("add-edge", ({ edge, callback }: any) => {
          edgeFnRef.current = callback;
          edgeRef.current = edge;

          setEdgeDialogTitle("Add Edge");
          setEdgeDialogDirected(1);
          setEdgeDialogOpen(true);
        });
      }
    }, [ref]);

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
);

export default VisNetwork;
