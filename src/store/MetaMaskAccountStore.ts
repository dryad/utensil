import axios from "libs/axios";
import { create } from 'zustand';

interface Address {
  id: number;
  name: string | null;
  address: string | null | undefined;
  about: string;
  avatar_url: string;
  avatar?: string;
}

interface MetaMaskState {
  metaMaskAccount: string;
  address: Address | null;
  getMetaMaskAccount: () => void;
  can_edit_profile: () => boolean;
  getAddress: (value: string) => void;
}

export const useMetaMaskAccountStore = create<MetaMaskState>((set, get) => ({
  metaMaskAccount: '', // The metamask account that is currently selected.
  address: null,
  
  getMetaMaskAccount: async() => {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      set({ metaMaskAccount: account});
      console.log('MetaMask account: ', account);
    }
  },

  can_edit_profile: () => {
    const metaMaskAccount = get().metaMaskAccount;
    const address = get().address;
    return metaMaskAccount === address?.address;
  },

  getAddress: async(value: string) => {
    const { data: address }: { data: Address } = await axios.get(`/api/address/${value}/`);
    set({ address });
  }

}));
