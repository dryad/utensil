import { create } from 'zustand';

interface GraphState {
  graphId: number | null;
  graphName: string;
  graphNote: string;
  isPrivate: boolean;
  graphCreator: string;
  prevGraphName: string;
  prevGraphNote: string;
  prevGraphPrivate: boolean;
  isDeletedGraph: boolean;

  setGraphName: (str: string) => void;
  setGraphNote: (str: string) => void;
  setIsPrivate: (val: boolean) => void;
  setGraphCreator: (str: string) => void;
  setGraphId: (val: number | null) => void;
  setIsDeletedGraph: (val: boolean) => void;
  setPrevGraphName: (str: string) => void;
  setPrevGraphNote: (str: string) => void;
  setPrevGraphPrivate: (val: boolean) => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  graphId: null,
  graphName: '',
  graphNote: '',
  isPrivate: false,
  graphCreator: '',
  prevGraphName: '',
  prevGraphNote: '',
  prevGraphPrivate: false,
  isDeletedGraph: false,

  setGraphName: (graphName) => set({ graphName }),
  setGraphNote: (graphNote) => set({ graphNote }),
  setIsPrivate: (isPrivate) => set({ isPrivate }),
  setGraphCreator: (graphCreator) => set({ graphCreator }),
  setGraphId: (graphId) => set({ graphId }),
  setIsDeletedGraph: (isDeletedGraph) => set({ isDeletedGraph }),
  setPrevGraphName: (prevGraphName) => set({ prevGraphName }),
  setPrevGraphNote: (prevGraphNote) => set({ prevGraphNote }),
  setPrevGraphPrivate: (prevGraphPrivate) => set({ prevGraphPrivate }),

}));