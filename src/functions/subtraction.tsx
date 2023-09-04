import { TreeNode, Edge, GraphData } from "../models";

export function subtraction(selNode:TreeNode, inputGraphData: any) {
 
    const edgeToSelNode = inputGraphData.edges;
    
    if (!edgeToSelNode.directed) {
        console.log('Graph is undirected. Subtraction is not possible.');
        return;
    }

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

    let result: number | null = null;
    
    if (canBeComputed) {
               
        const firstNumber = Number(fromNodes[0].label.trim());
        const secondNumber = Number(eventualNodes[0].label.trim());
                
        result = firstNumber - secondNumber;
    }
    console.log('SUBTRACTION function result: ', result);  
  }

  