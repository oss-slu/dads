// File: src/tests/frontend/tables/DataTable.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import DataTable from '../../components/DataTable';
import '@testing-library/jest-dom';

describe('DataTable component', () => {
  const labels = ['Name', 'Age', 'Country'];
  const data = [
    ['Alice', 30, 'USA'],
    ['Bob', 25, 'Canada'],
    ['Charlie', 35, 'UK']
  ];

  test('renders without crashing', () => {
    render(<DataTable labels={labels} data={data} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  test('renders all labels correctly', () => {
    render(<DataTable labels={labels} data={data} />);
    labels.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  test('renders all data rows correctly', () => {
    render(<DataTable labels={labels} data={data} />);
    data.forEach(row => {
      row.forEach(cell => {
        expect(screen.getByText(cell)).toBeInTheDocument();
      });
    });
  });

  test('renders pagination controls', () => {
    render(<DataTable labels={labels} data={data} />);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Last')).toBeInTheDocument();
  });

  test('matches snapshot', () => {
    const { asFragment } = render(<DataTable labels={labels} data={data} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
