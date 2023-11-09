import { Routes, Route, Navigate } from "react-router-dom";
import Utensil from "pages/Utensil";
import Profile from "pages/Profile";
import Layout from "layout/Layout";
import { useMetaMaskAccountStore } from "store/MetaMaskAccountStore";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";

function App() {
  
  const [metaMaskAccount, getMetaMaskAccount] = useMetaMaskAccountStore(
    useShallow((state) => [
      state.metaMaskAccount,
      state.getMetaMaskAccount,
    ])
  );

  useEffect(() => {
    getMetaMaskAccount();
  },[getMetaMaskAccount]);

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path="/" element={<Navigate to={`/profile/${metaMaskAccount}`} />} />
        <Route path="utensil" element={<Utensil />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/:addressId" element={<Profile />} />
      </Route>        
    </Routes>
  );
}

export default App;