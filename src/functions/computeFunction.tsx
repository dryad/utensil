import { TreeNode, Edge, GraphData } from "../models";
import { contractAction } from "../components/ContractButtonFunctions";

export function computeFunction(selNode:TreeNode, inputGraphData: any) {
 
    const edgeToSelNode = inputGraphData.edges![0];

    const fromNodes = edgeToSelNode && inputGraphData.nodes!.filter((el: any) => el.id === edgeToSelNode.from || el?.labelOfNode === edgeToSelNode.from);
    const eventualNodes = edgeToSelNode && inputGraphData.nodes!.filter((el: any) => el.id === edgeToSelNode.eventual || el?.labelOfNode === edgeToSelNode.eventual);

    let canBeComputed = true;

    // define if Graph can be computed

    const checkIfNotNumber = (string: string) => {
        if (string === '') {return true} 
        else {return isNaN(Number(string))}        
    }

    if (
        checkIfNotNumber(fromNodes[0].label.trim()) ||
        checkIfNotNumber(eventualNodes[0].label.trim()) ||
        !['+', '-', '*', '^', '/'].includes(selNode.label.trim()) || 
        (edgeToSelNode.directed === false && ['-', '^', '/'].includes(selNode.label.trim())) || 
        (Number(eventualNodes[0].label.trim()) === 0 && selNode.label.trim() === '/')      
    ) {
        canBeComputed = false;
    };

    let outputGraphData: GraphData | null = null;
    
    if (canBeComputed) {
        const {subGraphData} = contractAction(selNode, inputGraphData.nodes!, inputGraphData.edges!);

        const subGraphObject = { 
            edges: subGraphData?.edges, 
            nodes: subGraphData?.nodes, 
            viewPosition: inputGraphData.viewPosition, 
            scale: inputGraphData.scale 
          };
        const subGraph = JSON.stringify(subGraphObject);
        
        const firstNumber = Number(fromNodes[0].label.trim());
        const secondNumber = Number(eventualNodes[0].label.trim());
        let nodeName = 0; 
        
        switch (selNode.label.trim()) {
            case '+': 
                nodeName = firstNumber + secondNumber;
                break;
            case '-': 
                nodeName = firstNumber - secondNumber;
                break;   
            case '^': 
                nodeName = Math.pow(firstNumber, secondNumber);
                break;
            case '*': 
                nodeName = firstNumber * secondNumber;
                break;
            case '/': 
                nodeName = firstNumber / secondNumber;
                break;
        } ;
                            
        const updatedNodes = inputGraphData.nodes!
            .filter((el: TreeNode) => el.id === selNode.id || el.labelOfNode === selNode.id)
            .map((el: TreeNode) => {
                if (el.id === selNode.id) {
                    el.label = String(nodeName);
                    el.font = {color: "#fff"};
                    el.subGraphData = subGraph;
                    el.name = String(nodeName);
                    el.shape = "hexagon";
                    el.opacity = 1;
                }
                if (el.labelOfNode === selNode.id) {
                    el.label = String(nodeName);
                    el.font = {
                        color: "#000000",
                    };
                    el.opacity = 1;
                }
                return el;
            });

        outputGraphData = {
            edges: [],
            nodes: updatedNodes,
            viewPosition: inputGraphData.viewPosition,
            scale: inputGraphData.scale
        };
    }
      
    return { canBeComputed, outputGraphData }
  }