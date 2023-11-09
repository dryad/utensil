import { TreeNode, Edge } from "models";

export function contractAction(selNode:TreeNode, nodes: TreeNode[], edges: Edge[]) {

    const edgeToSelNode = edges.filter((el: Edge) => el.to === selNode.id); 
    
    let subGraphNodes: Set<TreeNode> = new Set();
    let subGraphEdges: Set<Edge> = new Set();

    const fromNodes = edgeToSelNode && nodes.filter((el) => el.id === edgeToSelNode[0]?.from || el?.labelOfNode === edgeToSelNode[0]?.from);
    const eventualNodes = edgeToSelNode && nodes.filter((el) => el.id === edgeToSelNode[0]?.eventual || el?.labelOfNode === edgeToSelNode[0]?.eventual);

    fromNodes.forEach((el) => subGraphNodes.add(el));
    eventualNodes.forEach((el) => subGraphNodes.add(el));
    subGraphEdges.add(edgeToSelNode[0]);

    let newNodes = Array.from(subGraphNodes);
    let arrayNodes = Array.from(subGraphNodes);

    for (let i = selNode.level - 1; i > 0; i--) {
      for (const node of arrayNodes) {
               
        if (node.level === i) {
          const e = edges.filter((el: any) => el.to === node.id);
          
          if (e.length > 0) {
            const fromTempNodes = nodes.filter((el: any) => el.id === e[0].from || (el.isLabelNode === true && el?.labelOfNode === e[0].from));
            const eventualTempNodes = nodes.filter((el: any) => el.id === e[0].eventual || (el.isLabelNode === true && el?.labelOfNode === e[0].eventual));
  
            newNodes.push(...fromTempNodes);
            newNodes.push(...eventualTempNodes);
            subGraphEdges.add(e[0]);
          }
        }
      }
      subGraphNodes = new Set(newNodes);
      arrayNodes = Array.from(subGraphNodes);
    }

    const externalEdgesSet = new Set(edges.filter((e: Edge) => !subGraphEdges.has(e))); 
    
    let canBeContracted = true;
    let subGraphNodeIdsSet: Set<string> = new Set();

    for (const node of Array.from(subGraphNodes)) {
      if (node.isLabelNode !== true) {
        subGraphNodeIdsSet.add(node.id);
      }
    }

    // define if subGraph can be contracted
    for (const edge of Array.from(externalEdgesSet)) {
      if ((subGraphNodeIdsSet.has(edge.from) || subGraphNodeIdsSet.has(edge.eventual))
        && !subGraphNodeIdsSet.has(edge.to)) {
          canBeContracted = false;
      }
    }

    let externalNodesSet: Set<TreeNode> = new Set();
    let subGraphData = null;
    let externalGraphData = null;

    if (canBeContracted) {
      externalNodesSet = new Set(nodes.filter((node) => !subGraphNodes.has(node)));
      subGraphData = {
        edges: Array.from(subGraphEdges),
        nodes: Array.from(subGraphNodes),
        nodeId: selNode.id
      };
      const selectedNodeHasLabel = nodes.filter((node: any) => node.labelOfNode === selNode.id)[0];
      subGraphData?.nodes.push(selNode);
      selectedNodeHasLabel && subGraphData?.nodes.push(selectedNodeHasLabel);

      externalGraphData = {
        edges: Array.from(externalEdgesSet),
        nodes: Array.from(externalNodesSet),
        nodeId: selNode.id
      };
    }
      
    return {canBeContracted, subGraphData, externalGraphData}
  }