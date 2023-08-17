import { TreeNode, Edge, GraphData } from "../models";

export function addition(selNode:TreeNode, inputGraphData: any) {
 
    const edgeToSelNode = inputGraphData.edges;
    
    const fromNodes = inputGraphData.nodes!.filter((el: TreeNode) => el.id === edgeToSelNode.from || el?.labelOfNode === edgeToSelNode.from);
    const eventualNodes = inputGraphData.nodes!.filter((el: TreeNode) => el.id === edgeToSelNode.eventual || el?.labelOfNode === edgeToSelNode.eventual);

    let canBeComputed = true;

    // define if Graph can be computed

    const checkIfNotNumber = (string: string) => {
        if (string === '') {return true} 
        else {return isNaN(Number(string))}        
    }

    if (
        checkIfNotNumber(fromNodes[0].label.trim()) ||
        checkIfNotNumber(eventualNodes[0].label.trim()) || 
        !selNode.subGraphId
    ) {
        canBeComputed = false;
    };

    let rezult: number | null = null;
    
    if (canBeComputed) {
               
        const firstNumber = Number(fromNodes[0].label.trim());
        const secondNumber = Number(eventualNodes[0].label.trim());
                
        rezult = firstNumber + secondNumber;
    }
    console.log('ADDITION function rezult: ', rezult);  
  }

  