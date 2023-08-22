import { TreeNode, Edge, GraphData } from "../models";
import dayjs from 'dayjs';

export function dateIsExpired(selNode:TreeNode, inputGraphData: any) {
 
    const edgeToSelNode = inputGraphData.edges;
    
    if (!edgeToSelNode.directed) {
        console.log('Graph is undirected. DateIsExpired is not possible.');
        return;
    }

    const fromNodes = inputGraphData.nodes!.filter((el: TreeNode) => el.id === edgeToSelNode.from || el?.labelOfNode === edgeToSelNode.from);
    const eventualNodes = inputGraphData.nodes!.filter((el: TreeNode) => el.id === edgeToSelNode.eventual || el?.labelOfNode === edgeToSelNode.eventual);

    let canBeComputed = true;

    // define if Graph can be computed

    const checkIfNotDate = (text: string) => {
        return !dayjs(text, 'LLL', true).isValid() 
    }

    if (
        checkIfNotDate(fromNodes[0].label.trim()) ||
        checkIfNotDate(eventualNodes[0].label.trim()) || 
        !selNode.subGraphId
    ) {
        canBeComputed = false;
    };

    let rezult: boolean | null = null;
    
    if (canBeComputed) {
               
        const firstDate = dayjs(fromNodes[0].label.trim());
        const secondDate = dayjs(eventualNodes[0].label.trim());
                
        rezult = firstDate.diff(secondDate) > 0;
    }
    console.log('DATE_IS_EXPIRED function rezult: ', rezult);  
  }

  