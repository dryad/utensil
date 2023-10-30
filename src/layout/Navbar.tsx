import { useLocation } from 'react-router-dom';
import ProfileNavbar from './ProfileNavbar';
import UtensilNavbar from './UtensilNavbar';
import Logo from '../components/Logo';
import PageSwitcher from '../components/PageSwitcher';
import { useUtensilModalStore } from 'store/UtensilModalStore';
import { useShallow } from 'zustand/react/shallow';

function Navbar(props: any) {
  const location = useLocation();
	const path = location.pathname.split('/')[1];


  const [openUtensilModal] = useUtensilModalStore(
    useShallow((state) => [
      state.openUtensilModal,
    ])
  );

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
      { (props.page === 'profile' || (props.page === 'utensil' && !openUtensilModal)) &&  
        <div style={{display:'flex',alignItems:'center', gap:'0.5rem'}}>
          <Logo />
          <PageSwitcher />
        </div>
      }
   
      <div style={{flex:'1'}}>
          {props.page === 'profile' 
            ? <ProfileNavbar /> 
            : null
          }
          {props.page === 'utensil' || openUtensilModal
            ? <UtensilNavbar 
                graphs={props.graphs}
                trees={props.trees} 
                hoveredNodes={props.hoveredNodes} 
                selectedNodes={props.selectedNodes} 
                setHoveredChipToVis={props.setHoveredChipToVis}
                networkRef={props.networkRef}
                refreshList={props.refreshList}
                onConfirmReplace={props.onConfirmReplace}
                onConfirmImport={props.onConfirmImport}
                onGraphSelected={props.onGraphSelected}
                toCloseBar={props.toCloseBar}
              />
            : null
          }
      </div>
    </div>
  )
}

export default Navbar;