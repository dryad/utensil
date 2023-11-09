import { create } from 'zustand';
import { getUsers } from 'services/axiosRequests';

type User = {
  name: string;
  address: string;
  avatar_url: string;
}

interface AllGraphsState {
  allUsers: User[];
  getAllUsers: () => void;
}

export const useAllUsersStore = create<AllGraphsState>((set, get) => ({
  allUsers: <User[]>[],

  getAllUsers: async() => {    
    getUsers()
    .then((res: any) => {
      if (Array.isArray(res.data)) {
        set({ allUsers: res.data })
      } 
      else {
        set({ allUsers: [] })
      }
    })  
    .catch((err: any) => {if (err) {set({ allUsers: [] })}});
  },

}));
