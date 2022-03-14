export type Graph = {
  id: number;
  name: string;
  data: string;
  note: string;
};

export type Node = {
  id: string;
  label: string;
  isLabelNode: boolean;
};

export type Edge = {
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
  x: number;
  y: number;
  level: number;
};

export type Tree = {
  nodes: TreeNode[];
}