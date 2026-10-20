import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import RationalPointsTable from '../../components/FunctionDetail/RationalPointsTable';
import { get_rational_periodic_data, get_graph_data } from '../../api/routes';

jest.mock('../../api/routes', () => ({
  get_rational_periodic_data: jest.fn(),
  get_graph_data: jest.fn()
}));

jest.mock('../../components/FunctionDetail/Copy', () => ({
  __esModule: true,
  default: ({ edges, type }) => require('react').createElement('div', { 'data-testid': `copy-${type}` }, edges)
}));

jest.mock('../../components/FunctionDetail/AdjacencyMatrix', () => ({
  __esModule: true,
  default: () => null
}));

const records = [
  { id: 1, function_id: 7, base_field_label: '1.1.1.1', rational_periodic_points: [[1, 0]], graph_id: 10 },
  { id: 2, function_id: 7, base_field_label: '2.2.8.1', rational_periodic_points: [[0, 1]], graph_id: 20 }
];

const graphA = { cardinality: 1, edges: [0], periodic_cycles: [1], preperiodic_components: [1], max_tail: 0 };
const graphB = { cardinality: 3, edges: [1, 2, 0], periodic_cycles: [3], preperiodic_components: [3], max_tail: 0 };

const rowFor = (label) => screen.getByText(label).closest('tr');

afterEach(() => jest.clearAllMocks());

test('each row shows its own graph', async () => {
  get_rational_periodic_data.mockResolvedValue({ data: records });
  get_graph_data.mockImplementation((id) => Promise.resolve({ data: id === 10 ? graphA : graphB }));

  render(<RationalPointsTable data={{ function_id: 7 }} />);
  await screen.findByText('1.1.1.1');

  expect(within(rowFor('1.1.1.1')).getByTestId('copy-2')).toHaveTextContent('[0]');
  expect(within(rowFor('2.2.8.1')).getByTestId('copy-2')).toHaveTextContent('[1, 2, 0]');
  expect(get_graph_data).toHaveBeenCalledTimes(2);
});

test('shows the no data message for an empty list', async () => {
  get_rational_periodic_data.mockResolvedValue({ data: [] });

  render(<RationalPointsTable data={{ function_id: 7 }} />);

  expect(await screen.findByText('No rational preperiodic data for this system.')).toBeInTheDocument();
  expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
});

test('shows N/A when a graph request fails', async () => {
  get_rational_periodic_data.mockResolvedValue({ data: records });
  get_graph_data.mockImplementation((id) => (id === 10 ? Promise.resolve({ data: graphA }) : Promise.reject(new Error('fail'))));

  render(<RationalPointsTable data={{ function_id: 7 }} />);
  await screen.findByText('2.2.8.1');

  const failedRow = rowFor('2.2.8.1');
  expect(within(failedRow).queryByTestId('copy-2')).not.toBeInTheDocument();
  expect(within(failedRow).getAllByText('N/A').length).toBeGreaterThan(0);
  expect(within(rowFor('1.1.1.1')).getByTestId('copy-2')).toBeInTheDocument();
});