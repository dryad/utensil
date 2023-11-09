export const INPUTGRAPHDATA_ADD = {
    edges: [
        {
            id: "1",
            directed: false,
            from: "from1",
            eventual: "eventual1",            
            to: "to1"
        }        
    ], 
    nodes: [
        {
            id: "to1",
            color: "#ff5252",
            font: { color: '#fff'},
            label: "+",
            level: 1,
            opacity: 1,
            x: 0,
            y: 0
        },
        {
            id: "to2",
            font: {size: 14, color: '#000000'},
            isLabelNode: true,
            label: "+",
            labelOfNode: "to1",
            level: 1,
            opacity: 1,
            shape: "ellipse",
            x: 0,
            y: 0
        },
        {
            id: "from1",
            color: "#333",
            font: { color: '#fff'},
            label: "2",
            level: 0,
            opacity: 1,
            x: 0,
            y: 0
        },
        {
            id: "from2",
            font: {size: 14, color: '#000000'},
            isLabelNode: true,
            label: "2",
            labelOfNode: "from1",
            level: 0,
            opacity: 1,
            shape: "ellipse",
            x: 0,
            y: 0
        },
        {
            id: "eventual1",
            color: "#333",
            font: { color: '#fff'},
            label: "5",
            level: 0,
            opacity: 1,
            x: 0,
            y: 0
        },
        {
            id: "eventual2",
            font: {size: 14, color: '#000000'},
            isLabelNode: true,
            label: "5",
            labelOfNode: "eventual1",
            level: 0,
            opacity: 1,
            shape: "ellipse",
            x: 0,
            y: 0
        },
        
    ], 
    viewPosition: {x: 0, y: 0}, 
    scale: 1 
}

export const SELECTED_NODE = {
    id: "to1",
    color: "#ff5252",
    label: "+",
    level: 1,
    opacity: 1,
    x: 0,
    y: 0
}

const subGraphData = "{\"edges\":[{\"id\":\"1\",\"directed\":false,\"from\":\"from1\",\"eventual\":\"eventual1\",\"to\":\"to1\"}],\"nodes\":[{\"id\":\"from1\",\"color\":\"#333\",\"font\":{\"color\":\"#fff\"},\"label\":\"2\",\"level\":0,\"opacity\":1,\"x\":0,\"y\":0},{\"id\":\"from2\",\"font\":{\"size\":14,\"color\":\"#000000\"},\"isLabelNode\":true,\"label\":\"2\",\"labelOfNode\":\"from1\",\"level\":0,\"opacity\":1,\"shape\":\"ellipse\",\"x\":0,\"y\":0},{\"id\":\"eventual1\",\"color\":\"#333\",\"font\":{\"color\":\"#fff\"},\"label\":\"5\",\"level\":0,\"opacity\":1,\"x\":0,\"y\":0},{\"id\":\"eventual2\",\"font\":{\"size\":14,\"color\":\"#000000\"},\"isLabelNode\":true,\"label\":\"5\",\"labelOfNode\":\"eventual1\",\"level\":0,\"opacity\":1,\"shape\":\"ellipse\",\"x\":0,\"y\":0},{\"id\":\"to1\",\"color\":\"#ff5252\",\"label\":\"+\",\"level\":1,\"opacity\":1,\"x\":0,\"y\":0},{\"id\":\"to2\",\"font\":{\"size\":14,\"color\":\"#000000\"},\"isLabelNode\":true,\"label\":\"+\",\"labelOfNode\":\"to1\",\"level\":1,\"opacity\":1,\"shape\":\"ellipse\",\"x\":0,\"y\":0}],\"viewPosition\":{\"x\":0,\"y\":0},\"scale\":1}"

export const OUTPUTGRAPHDATA_ADD = {
    edges: [], 
    nodes: [
        {
            id: "to1",
            color: "#ff5252",
            label: "7",
            level: 1,
            name: "7",
            opacity: 1,
            shape: "hexagon",
            font: {color: '#fff'},
            subGraphData: subGraphData,
            x: 0,
            y: 0
        },
        {
            id: "to2",
            font: {color: '#000000'},
            isLabelNode: true,
            label: "7",
            labelOfNode: "to1",
            level: 1,
            opacity: 1,
            shape: "ellipse",
            x: 0,
            y: 0
        },
    ], 
    viewPosition: {x: 0, y: 0}, 
    scale: 1 
}
