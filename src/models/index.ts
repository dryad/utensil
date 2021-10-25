export type Graph = {
  id: number;
  name: string;
  data: string;
  note: string;
};

export type Node = {
  id: string;
  label: string;
};

export type Edge = {
  from: string;
  to: string;
  eventual: string;
};
