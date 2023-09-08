import { TreeNode } from "../models";

export function naturalLogarithm(selNode:TreeNode, inputGraphData: any) {
 
    const edgeToSelNode = inputGraphData.edges;

    if (!edgeToSelNode.directed) {
        console.log('Graph is undirected. Natural logarithm operation is not possible.');
        return;
    }
    
    const eventualNodes = inputGraphData.nodes!.filter((el: TreeNode) => el.id === edgeToSelNode.eventual || el?.labelOfNode === edgeToSelNode.eventual);

    let canBeComputed = true;

    // define if Graph can be computed

    const checkIfNotNumber = (string: string) => {
        if (string === '') {return true} 
        else {return isNaN(Number(string))}        
    }

    if (
        checkIfNotNumber(eventualNodes[0].label.trim()) || 
        Number(eventualNodes[0].label.trim()) <= 0 ||
        !selNode.subGraphId
    ) {
        canBeComputed = false;
    };

    if (eventualNodes[0].label.trim() === 'e') {
        canBeComputed = true;
    }

    let result: number | null = null;
    
    if (canBeComputed) {
        const secondNumber = checkIfNotNumber(eventualNodes[0].label.trim()) ? 
            Math.exp(1) :
            Number(eventualNodes[0].label.trim());
                
        result = Math.log(secondNumber);
    }
    console.log('NATURAL LOGARITHM function result: ', result);  
  }

  