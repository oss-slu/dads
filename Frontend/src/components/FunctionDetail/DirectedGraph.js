import React, { useEffect, useMemo, useRef } from 'react';
import cytoscape from 'cytoscape';
import { parseEdges } from './graphEdges';

const DirectedGraph = ({ edges }) => {
    const containerRef = useRef(null);
    const targets = useMemo(() => parseEdges(edges), [edges]);

    useEffect(() => {
        if (targets.length === 0) return undefined;

        const cy = cytoscape({
            container: containerRef.current,
            elements: [
                ...targets.map((_, point) => ({ data: { id: `${point}` } })),
                ...targets.map((target, point) => ({
                    data: { id: `${point}-${target}`, source: `${point}`, target: `${target}` },
                })),
            ],
            style: [
                {
                    selector: 'node',
                    style: {
                        label: 'data(id)',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        color: '#fff',
                        'background-color': '#343a40',
                    },
                },
                {
                    selector: 'edge',
                    style: {
                        'curve-style': 'bezier',
                        'target-arrow-shape': 'triangle',
                        'line-color': '#6c757d',
                        'target-arrow-color': '#6c757d',
                    },
                },
            ],
            layout: { name: 'cose', animate: false, padding: 30 },
        });

        return () => cy.destroy();
    }, [targets]);

    if (targets.length === 0) {
        return <p>This graph is empty.</p>;
    }

    return <div ref={containerRef} style={{ width: '100%', height: '400px' }} />;
};

export default DirectedGraph;