import { create } from 'zustand';

interface MetaMaskState {
  metaMaskAccount: string;
  getMetaMaskAccount: () => void;
}

export const useMetaMaskAccountStore = create<MetaMaskState>((set) => ({
  metaMaskAccount: '', // The metamask account that is currently selected.
  
  getMetaMaskAccount: async() => {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      set({ metaMaskAccount: account});
      console.log('MetaMask account: ', account);
    }
  },
}));