import VisCustomNetwork from "libs/vis-custom-network";
import { saveGraph, shareGraph, deleteGraph, editProfile } from 'services/axiosRequests';
import { Address } from 'models';

export const stringifyCurrentGraph = (networkRef: React.MutableRefObject<VisCustomNetwork | null>) => { 
    
    const edges = networkRef.current?.edges.get();
    const nodes = networkRef.current?.nodes.get();
    const positions = networkRef.current?.network.getPositions();

    if (nodes) {
      for (const node of nodes) {
        node.x = positions[node.id].x;
        node.y = positions[node.id].y;
      }
    }

    //create viewPosition using the getViewPosition function of vis-network
    const viewPosition = networkRef.current?.network.getViewPosition();
    const scale = networkRef.current?.network.getScale();

    return JSON.stringify({ edges, nodes, viewPosition, scale });  
  };
 

  export async function saveGraphToDB (
    isNew: boolean = false, 
    graphName: string,
    graphNote: string,
    metaMaskAccount: string,
    isPrivate: boolean,
    networkRef: React.MutableRefObject<VisCustomNetwork | null>,
    refreshList: Function,
    setIsSaveGraphResponseStatusOk: Function,
    setGraphId: Function,
    graphId?: number | null    
    ){
       
    const dataToSave = {
      ...(!isNew && {id: graphId}),
      name: graphName,
      note: graphNote,
      data: stringifyCurrentGraph(networkRef),
      creator: metaMaskAccount,
      private: isPrivate ? metaMaskAccount : "",
    }

    saveGraph(dataToSave)
      .then((res) => {
        if (res.data.id) {
          console.log('Saved graph to the database with this id: ', res.data.id);
          setGraphId(parseInt(res.data.id))
          refreshList();
          setIsSaveGraphResponseStatusOk(true);
        }
      })
      .catch(err => {if (err) {console.log(err); setIsSaveGraphResponseStatusOk(false)}})
  };

  export async function shareGraphToDB (
    addressToShare: string, 
    graphId: number,
    setIsShareGraphResponseStatusOk: Function,
  ){
    shareGraph(addressToShare, graphId)
      .then((res) => {
        if (res.status === 201) {
          setIsShareGraphResponseStatusOk(true);
        }
      })
      .catch(err => {if (err) {console.log(err); setIsShareGraphResponseStatusOk(false)}})
  };

  export async function deleteGraphFromDB (id: number, setIsDeleteGraphResponseStatusOk: Function,
  ){
    deleteGraph(id)
      .then((res) => {
        if (res.status === 204) {
          setIsDeleteGraphResponseStatusOk(true);
        }
      })
      .catch(err => {if (err) {console.log(err); setIsDeleteGraphResponseStatusOk(false)}})
  };

  export async function saveProfileToDB (
    account: string,
    editAddress: Address,
    setIsSaveProfileResponseStatusOk: Function   
    ){   
      editProfile(account, editAddress)
        .then((res) => {
          if (res.status === 200) {
            setIsSaveProfileResponseStatusOk(true);
          }
        })
        .catch(err => {if (err) {console.log(err); setIsSaveProfileResponseStatusOk(false)}})
  };