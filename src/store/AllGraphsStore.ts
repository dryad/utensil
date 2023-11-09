import { create } from 'zustand';
import { Graph } from 'models';
import { getPublicGraphs, getPrivateGraphs, getSharedGraphs } from 'services/axiosRequests';

interface AllGraphsState {
  allGraphs: Graph[];
  publicGraphs: Graph[];
  privateGraphs: Graph[];
  sharedGraphs: Graph[];  
  searchString: string;
  getAllGraphs: () => void;
  getPublicGraphs: () => void;
  getPrivateGraphs: (wallet: string) => void;
  getSharedGraphs: (wallet: string) => void;
  setSearchString: (searchString: string) => void;
}

export const useAllGraphsStore = create<AllGraphsState>((set, get) => ({
  allGraphs: <Graph[]>[],
  publicGraphs: <Graph[]>[],
  privateGraphs: <Graph[]>[],
  sharedGraphs: <Graph[]>[],
  searchString: "",

  getAllGraphs: async() => {    

  },

  getPublicGraphs: async() => {
    getPublicGraphs()
    .then((res: any) => {
      if (Array.isArray(res)) {
        set({ publicGraphs: res })
      } 
      else {
        set({ publicGraphs: [] })
      }
    })  
    .catch((err: any) => {if (err) {set({ publicGraphs: [] })}});
  },

  getPrivateGraphs: async(wallet: string) => {
    getPrivateGraphs(wallet)
    .then((res: any) => {
      if (Array.isArray(res)) {
        set({ privateGraphs: res })
      } 
      else {
        set({ privateGraphs: [] })
      }
    })  
    .catch((err: any) => {if (err) {set({ privateGraphs: [] })}});
  },

  getSharedGraphs: async(wallet: string) => {
    getSharedGraphs(wallet)
    .then((res: any) => {
      if (Array.isArray(res)) {
        set({ sharedGraphs: res })
      } 
      else {
        set({ sharedGraphs: [] })
      }
    })  
    .catch((err: any) => {if (err) {set({ sharedGraphs: [] })}});
  },
  setSearchString: (searchString) => set({searchString}), 

}));
