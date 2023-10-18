import { Routes, Route, Navigate } from "react-router-dom";
import Utensil from "pages/Utensil";
import Profile from "pages/Profile";
import EditProfile from "components/EditProfile";
import Layout from "layout/Layout";
import { useMetaMaskAccountStore } from "store/MetaMaskAccountStore";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";

function App() {
  
  const [getMetaMaskAccount] = useMetaMaskAccountStore(
    useShallow((state) => [
      state.getMetaMaskAccount,
    ])
  );

  useEffect(() => {
    getMetaMaskAccount();
  },[getMetaMaskAccount])

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path="/" element={<Navigate to="/profile" />} />
        <Route path="utensil" element={<Utensil />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/:addressId" element={<Profile />} />
        <Route path="profile/edit" element={<EditProfile />} />
      </Route>        
    </Routes>
  );
}

export default App;