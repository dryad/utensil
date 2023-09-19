import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div 
      style={{ 
        height: '100vh', 
        width: '100vw', 
        padding: '0.5rem 1rem 1rem', 
        margin: '0 auto',
        display:'flex',
        flexDirection:'column', 
      }}
    >
      <Outlet />
    </div>
  )
}

export default Layout;