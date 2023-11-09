import { TreeNode } from "../models";

export function logarithm(selNode:TreeNode, inputGraphData: any) {
 
    const edgeToSelNode = inputGraphData.edges;

    if (!edgeToSelNode.directed) {
        console.log('Graph is undirected. Logarithm operation is not possible.');
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

    const getBaseLog = (a: number, b: number) => {
        return Math.log(b) / Math.log(a);
    }

    if (
        (checkIfNotNumber(fromNodes[0].label.trim()) && fromNodes[0].label.trim() !== 'e') ||
        (checkIfNotNumber(eventualNodes[0].label.trim()) && eventualNodes[0].label.trim() !== 'e') || 
        Number(fromNodes[0].label.trim()) <= 0 ||
        Number(fromNodes[0].label.trim()) === 1 ||
        Number(eventualNodes[0].label.trim()) <= 0 ||
        !selNode.subGraphId
    ) {
        canBeComputed = false;
    };

    let result: number | null = null;
    
    if (canBeComputed) {
        const firstNumber = checkIfNotNumber(fromNodes[0].label.trim()) ? 
            Math.exp(1) :
            Number(fromNodes[0].label.trim());
        
        const secondNumber = checkIfNotNumber(eventualNodes[0].label.trim()) ? 
            Math.exp(1) :
            Number(eventualNodes[0].label.trim());
                
        result = getBaseLog(firstNumber, secondNumber);
    }
    console.log('LOGARITHM function result: ', result);  
  }

  