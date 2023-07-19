export type Node = {
  id: string;
  label: string;
  isLabelNode: boolean;
};

export type Edge = {
  id: string;
  from: string;
  to: string;
  eventual: string;
  directed: boolean;
};

export type TreeNode = {
  id: string;
  color: string;
  label: string;
  isLabelNode: boolean;
  labelOfNode: string;
  x: number;
  y: number;
  level: number;
  subGraphData: string;
  name?: string;
};

export type Graph = {
  id?: number;
  name: string;
  data: string;
  note: string;
  nodes?: TreeNode[];
  edges?: Edge[];
  preview: string;
  preview_url: string;
};

export type Tree = {
  nodes: TreeNode[];
}