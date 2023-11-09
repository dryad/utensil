import dayjs from "dayjs";
import { TreeNode } from "../models";

export function isLessThanOrEqualTo(selNode:TreeNode, inputGraphData: any) {
    
    const outputResult = (result: boolean | null = null) => {
        console.log('IS LESS THAN OR EQUAL TO function result: ', result);  
    }

    if (!selNode.subGraphId) {
        outputResult();
        return;
    }
 
    const edgeToSelNode = inputGraphData.edges;
    
    const fromNodes = inputGraphData.nodes!.filter((el: TreeNode) => el.id === edgeToSelNode.from || el?.labelOfNode === edgeToSelNode.from);
    const eventualNodes = inputGraphData.nodes!.filter((el: TreeNode) => el.id === edgeToSelNode.eventual || el?.labelOfNode === edgeToSelNode.eventual);

    if (fromNodes[0].opacity === 0 || eventualNodes[0].opacity === 0) {
        outputResult();
        return;
    }

    const checkIfNumber = (string: string) => {
        if (string === '') {return false} 
        else {return !isNaN(Number(string))}        
    }

    const checkIfDate = (text: string) => {
        return dayjs(text, 'LLL', true).isValid() 
    }

    let result: boolean | null = null;

    const firstElement = fromNodes[0].label.trim();
    const secondElement = eventualNodes[0].label.trim();

    if (checkIfNumber(firstElement) && checkIfNumber(secondElement)) {
        result = Number(firstElement) <= Number(secondElement);
        outputResult(result);
        return;
    }

    if (
        (checkIfNumber(firstElement) && !checkIfNumber(secondElement)) ||
        (!checkIfNumber(firstElement) && checkIfNumber(secondElement))
    ) {
        outputResult(); 
        return;
    }

    if (checkIfDate(firstElement) && checkIfDate(secondElement)) {
        result = dayjs(firstElement).diff(dayjs(secondElement)) <= 0;
        outputResult(result);
        return;
    }

    if (
        (checkIfDate(firstElement) && !checkIfDate(secondElement)) ||
        (!checkIfDate(firstElement) && checkIfDate(secondElement))
    ) {
        outputResult();
        return;
    }

    result = firstElement.localeCompare(secondElement) <= 0;
    outputResult(result);
  }
  