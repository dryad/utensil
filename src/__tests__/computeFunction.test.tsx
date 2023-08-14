import { INPUTGRAPHDATA_ADD, SELECTED_NODE, OUTPUTGRAPHDATA_ADD } from '../_test_helpers/computeFunction_data';
import { computeFunction } from '../functions/computeFunction';

describe('computeFunction test cases', () => {
      
    test('inputGraph: 2 + 5, outputGraph: 7', () => {
        expect(
            computeFunction(SELECTED_NODE, INPUTGRAPHDATA_ADD))
        .toEqual({
            canBeComputed: true, 
            outputGraphData: OUTPUTGRAPHDATA_ADD
        })
    })

   
})