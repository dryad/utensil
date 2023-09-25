import { useLocation } from 'react-router-dom';
import ProfileNavbar from './ProfileNavbar';
import UtensilNavbar from './UtensilNavbar';
import Logo from '../components/Logo';
import PageSwitcher from '../components/PageSwitcher';

function Navbar(props: any) {
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
      <div style={{flex:'1'}}>
          {path === 'profile' 
            ? <ProfileNavbar /> 
            : <UtensilNavbar 
                getMetaMaskAccount={props.getMetaMaskAccount} 
                metaMaskAccount={props.metaMaskAccount}
                trees={props.trees} 
                hoveredNodes={props.hoveredNodes} 
                selectedNodes={props.selectedNodes} 
                setHoveredChipToVis={props.setHoveredChipToVis}
                graphName={props.graphName}
                onConfirmReplace={props.onConfirmReplace}
                onConfirmImport={props.onConfirmImport}
                onGraphSelected={props.onGraphSelected}
              />
          }
      </div>
    </div>
  )
}

export default Navbar;