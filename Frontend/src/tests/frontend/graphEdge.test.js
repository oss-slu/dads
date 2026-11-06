import { parseEdges, generateAdjacencyMatrix } from '../../components/FunctionDetail/graphEdges';

describe('parseEdges', () => {
    test('reads the list with or without spaces', () => {
        expect(parseEdges('[3, 1, 2, 3]')).toEqual([3, 1, 2, 3]);
        expect(parseEdges('[3,1,2,3]')).toEqual([3, 1, 2, 3]);
    });

    test('an empty list has no points', () => {
        expect(parseEdges('[]')).toEqual([]);
    });
});

describe('generateAdjacencyMatrix', () => {
    test('marks where each point goes', () => {
        expect(generateAdjacencyMatrix('[1, 0]')).toEqual([[0, 1], [1, 0]]);
    });

    test('an empty list gives an empty matrix', () => {
        expect(generateAdjacencyMatrix('[]')).toEqual([]);
    });
});