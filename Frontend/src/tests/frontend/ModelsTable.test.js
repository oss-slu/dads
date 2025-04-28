// File: tests/frontend/tables/ModelsTable.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import ModelsTable, { renderExponent, processInput, splitOutermostCommas } from '../../components/FunctionDetail/ModelsTable';
import '@testing-library/jest-dom';

// Pure function tests
describe('processInput function', () => {
  test('formats polynomial correctly', () => {
    const input = "{{1,0,2},{0,1,3}}";
    const result = processInput(input);
    expect(result).toEqual(["[x^2 + 2y^2 : x^1y^1 + 3y^2]"]);
  });

  test('handles zero coefficients', () => {
    const input = "{{1,0,0},{0,0,1}}";
    const result = processInput(input);
    expect(result).toEqual(["[x^2 : y^2]"]);
  });

  test('handles empty input', () => {
    const input = "{{},{}}";
    const result = processInput(input);
    expect(result).toEqual(["[ : ]"]);
  });
});

describe('splitOutermostCommas function', () => {
  test('splits correctly', () => {
    const input = "{x,y},{a,b}";
    const result = splitOutermostCommas(input);
    expect(result).toEqual(["{x,y}", "{a,b}"]);
  });

  test('handles nested brackets', () => {
    const input = "{x,{y,z}},{a,b}";
    const result = splitOutermostCommas(input);
    expect(result).toEqual(["{x,{y,z}}", "{a,b}"]);
  });
});

describe('renderExponent function', () => {
  test('renders exponents correctly', () => {
    const { container } = render(<>{renderExponent(['x^2', 'y^3'])}</>);
    expect(container.textContent).toContain('x');
    expect(container.textContent).toContain('2');
    expect(container.textContent).toContain('y');
    expect(container.textContent).toContain('3');
  });
});

// Component test
describe('ModelsTable component', () => {
  const mockData = {
    original_model: "{x^2,y^2}",
    reduced_model: "{x^2,y^2}",
    cp_field_of_defn: "1.1.1.1"
  };

  test('renders without crashing', () => {
    render(<ModelsTable data={mockData} />);
    expect(screen.getByTestId('models-table')).toBeInTheDocument();
  });

  test('matches snapshot', () => {
    const { asFragment } = render(<ModelsTable data={mockData} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
