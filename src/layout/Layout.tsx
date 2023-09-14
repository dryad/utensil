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
      <nav>
        <Navbar />
      </nav>
      <main style={{ width: '100%', flex: '1 1 auto' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout;