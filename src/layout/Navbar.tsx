import { useLocation } from 'react-router-dom';
import ProfileNavbar from './ProfileNavbar';
import UtensilNavbar from './UtensilNavbar';
import Logo from '../components/Logo';
import PageSwitcher from '../components/PageSwitcher';

function Navbar() {
  const location = useLocation();
	const path = location.pathname.split('/')[1];

  return (
    <div 
      style={{ 
        height: '55px', 
        width: '100%', 
        display:'flex', 
        alignItems:'center', 
        justifyContent:"space-between" 
      }}
    >
      <div style={{display:'flex',alignItems:'center', gap:'0.5rem'}}>
          <Logo />
          <PageSwitcher />
      </div>
      <div >
          {path === 'profile' ? <ProfileNavbar /> : <UtensilNavbar />}
      </div>
    </div>
  )
}

export default Navbar;