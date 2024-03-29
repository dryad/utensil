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
  isLabelNode?: boolean | undefined;
  labelOfNode?: string | undefined;
  x: number;
  y: number;
  level: number;
  subGraphData?: string | undefined;
  name?: string | undefined;
  subGraphId?: number | undefined;
  isUneditable?: boolean;
  opacity: number;
  shape?: string | undefined;
  font?: {
    color: string
  }
};

export type Graph = {
  id?: number;
  name: string;
  data: string;
  note: string;
  nodes?: TreeNode[];
  edges?: Edge[];
  creator: string;
  private: string;
};

export type GraphData = {
  edges?: Edge[];
  nodes?: TreeNode[];
  viewPosition: {
    x: number,
    y: number
  }
  scale?: number
};

export type Tree = {
  nodes: TreeNode[];
}

export interface Address {
  id?: number | undefined;
  name: string | null | undefined;
  address?: string | null | undefined;
  about: string | undefined;
  avatar_url?: string | undefined;
  avatar?: string | undefined;
}