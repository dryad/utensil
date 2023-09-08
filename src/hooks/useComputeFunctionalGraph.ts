import { useEffect } from "react";
import VisCustomNetwork from "../libs/vis-custom-network";
import { TreeNode, Edge, Graph } from "models";
import * as functions from '../functions';
import functionalGraphData from "../functions/functionalGraphIds.json"; 

export const useComputeFunctionalGraph = (networkRef: React.MutableRefObject<VisCustomNetwork | null>) => {
    const nodes: TreeNode[] = networkRef.current?.nodes.get();
    const edges = networkRef.current?.edges.get();
    
    useEffect(() => {
        if (nodes && nodes.length) {
            for (let node of nodes) {
                if (
                    node.hasOwnProperty('subGraphId') 
                ) {
                    const edgeToSelNode = edges.find((el: Edge) => el.to === node.id);
        
                    const fromNodes = edgeToSelNode && nodes.filter((el: TreeNode) => el.id === edgeToSelNode.from || el?.labelOfNode === edgeToSelNode.from);
                    const eventualNodes = edgeToSelNode && nodes.filter((el: TreeNode) => el.id === edgeToSelNode.eventual || el?.labelOfNode === edgeToSelNode.eventual);
                    const toNodes = edgeToSelNode && nodes.filter((el: TreeNode) => el.id === edgeToSelNode.to || el?.labelOfNode === edgeToSelNode.to);
        
                    const inputGraphData = { 
                        edges: edgeToSelNode, 
                        nodes: [...fromNodes, ...eventualNodes, ...toNodes], 
                    };

                    let functionName = functionalGraphData[node.subGraphId?.toString() as keyof typeof functionalGraphData];
                                                   
                    functionName && functions[functionName as keyof typeof functions](node, inputGraphData);
                }    
            }
        }
    }, [nodes, edges])
    
}