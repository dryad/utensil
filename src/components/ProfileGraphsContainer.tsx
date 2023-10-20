import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useAllGraphsStore } from 'store/AllGraphsStore';
import { useMetaMaskAccountStore } from 'store/MetaMaskAccountStore';
import { useShallow } from "zustand/react/shallow";

type Props = {
  currentTab: number;
}

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}


function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function ProfileGraphsContainer({ currentTab }: Props) {

  const [publicGraphs, privateGraphs, sharedGraphs, getPublicGraphs, getPrivateGraphs, getSharedGraphs] = useAllGraphsStore(
    useShallow((state) => [
        state.publicGraphs,
        state.privateGraphs,
        state.sharedGraphs,
        state.getPublicGraphs,
        state.getPrivateGraphs,
        state.getSharedGraphs
    ])
);  

const [can_edit_profile] = useMetaMaskAccountStore(
  useShallow((state) => [
    state.can_edit_profile
  ])
);

  return (
    <div 
      style={{
        display:'flex',
        justifyContent:'space-between'
      }}
    >
     
     {publicGraphs.length > 0 && (
          <TabPanel value={currentTab} index={0}>
              <div style={{ width: '100%' }}>
                  {publicGraphs.map((graph) => {
                    return (
                      <div key={graph.id}>
                        {graph.name}
                      </div>
                    )
                  }) 
                  }
              </div>
          </TabPanel>
      )}
      {publicGraphs.length === 0 && (
          <TabPanel value={currentTab} index={0}>
              <div style={{ width: '100%' }}>
                no graphs... or no access
              </div>
          </TabPanel>
      )}
      { can_edit_profile() && privateGraphs.length > 0 && (
          <TabPanel value={currentTab} index={1}>
              <div style={{ width: '100%' }}>
                {privateGraphs.map((graph) => {
                  return (
                    <div key={graph.id}>
                      {graph.name}
                    </div>
                  )
                }) 
                }
              </div>
          </TabPanel>
      )}
      { (!can_edit_profile() || (can_edit_profile() && privateGraphs.length === 0)) && (
          <TabPanel value={currentTab} index={1}>
              <div style={{ width: '100%' }}>
                no graphs... or no access
              </div>
          </TabPanel>
      )}
      { can_edit_profile() && sharedGraphs.length > 0 && (
          <TabPanel value={currentTab} index={2}>
              <div style={{ width: '100%' }}>
                {sharedGraphs.map((graph) => {
                  return (
                    <div key={graph.id}>
                      {graph.name}
                    </div>
                  )
                }) 
                }
              </div>
          </TabPanel>
      )}
      { (!can_edit_profile() || (can_edit_profile() && sharedGraphs.length === 0)) && (
          <TabPanel value={currentTab} index={2}>
              <div style={{ width: '100%' }}>
                no graphs... or no access
              </div>
          </TabPanel>
      )}
    </div>
  )
}

export default ProfileGraphsContainer;