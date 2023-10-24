import { Box, Typography, styled } from '@mui/material';
import { ReactNode } from 'react';
import { useAllGraphsStore } from 'store/AllGraphsStore';
import { useMetaMaskAccountStore } from 'store/MetaMaskAccountStore';
import { useShallow } from "zustand/react/shallow";
import ProfileGraphItem from './ProfileGraphItem';
import { THEME_COLORS } from 'constants/colors';

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

const StyledBox = styled('div')(() => ({
  display:'flex', 
  justifyContent:'space-between', 
  flexWrap:'wrap', 
  gap: '28px' 
}))

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
        width: '100%',
        height: '0'
      }}
    >
      {publicGraphs.length > 0 && (
          <TabPanel value={currentTab} index={0}>
            <StyledBox>
              {publicGraphs.map((graph) => {
                return (
                  <div key={graph.id}>
                    <ProfileGraphItem graph={graph} />
                  </div>
                )
              })}
            </StyledBox>
          </TabPanel>
      )}
      {publicGraphs.length === 0 && (
          <TabPanel value={currentTab} index={0}>
              <div style={{ width: '100%' }}>
                No graphs... 
              </div>
          </TabPanel>
      )}
      { can_edit_profile() && privateGraphs.length > 0 && (
          <TabPanel value={currentTab} index={1}>
              <StyledBox>
                {privateGraphs.map((graph) => {
                  return (
                    <div key={graph.id}>
                      <ProfileGraphItem graph={graph} />
                    </div>
                  )
                })}
              </StyledBox>
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
          <StyledBox>
            {sharedGraphs.map((graph) => {
              return (
                <div key={graph.id}>
                  <ProfileGraphItem graph={graph} />
                </div>
              )
            })}
          </StyledBox>
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