// Position i in the list says where point i goes: "[3, 1]" means 0->3, 1->1
export const parseEdges = (edges) => (String(edges).match(/\d+/g) || []).map(Number);

export const generateAdjacencyMatrix = (edges) => {
    const targets = parseEdges(edges);
    const matrix = targets.map(() => Array(targets.length).fill(0));
    targets.forEach((target, point) => {
        matrix[point][target] = 1;
    });
    return matrix;
};