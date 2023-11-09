import { create } from 'zustand';
import { Graph } from 'models';

interface UtensilModalState {
  selectedGraph: Graph | null | undefined;
  openUtensilModal: boolean;
  showWarningUnsaved: boolean;
  clickCloseButton: boolean;
  setSelectedGraph: (selectedGraph: Graph | null | undefined) => void;
  setOpenUtensilModal: (newGraphOnUtensilModal: boolean) => void;
  setShowWarningUnsaved: (showWarningUnsaved: boolean) => void;
  setClickCloseButton: (clickCloseButton: boolean) => void;
}

export const useUtensilModalStore = create<UtensilModalState>((set) => ({
  selectedGraph: null, 
  openUtensilModal: false,
  showWarningUnsaved: false,
  clickCloseButton: false,
  setSelectedGraph: (selectedGraph) => set({ selectedGraph }),
  setOpenUtensilModal: (openUtensilModal) => set({ openUtensilModal }),
  setShowWarningUnsaved: (showWarningUnsaved) => set({ showWarningUnsaved }),
  setClickCloseButton: (clickCloseButton) => set({ clickCloseButton }),
}));