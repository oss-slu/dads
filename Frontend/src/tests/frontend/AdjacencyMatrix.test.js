import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdjacencyMatrix from '../../components/FunctionDetail/AdjacencyMatrix';

const openModal = (edges) => {
    render(<AdjacencyMatrix modalTitle="Adjacency Matrix" edges={edges} />);
    fireEvent.click(screen.getByText('Show'));
};

test('an empty graph says it is empty instead of showing [[1]]', () => {
    openModal('[]');
    expect(screen.getByText('This graph is empty.')).toBeInTheDocument();
    expect(document.querySelector('pre')).toBeNull();
});

test('a non-empty graph still shows its matrix', () => {
    openModal('[1, 0]');
    expect(screen.queryByText('This graph is empty.')).toBeNull();
    expect(document.querySelector('pre').textContent).toBe('0 1 \n1 0 \n');
});