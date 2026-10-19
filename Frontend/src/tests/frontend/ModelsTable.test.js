// File: Frontend/src/tests/frontend/ModelsTable.test.js
// Tests for ModelsTable and its helper functions.

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModelsTable, { renderExponent, buildModelString, splitOutermostCommas } from '../../components/FunctionDetail/ModelsTable';


// Pure function tests

// Coefficient strings are {{f coefficients},{g coefficients}}; degree 2 terms are x^2, xy, y^2
describe('buildModelString function', () => {
  test('formats a degree 2 model with a negative coefficient', () => {
    expect(buildModelString('{{1,0,-1},{0,0,1}}', 2)).toBe('[x^2 - y^2 : y^2]');
  });

  test('formats a model where every coefficient is nonzero', () => {
    expect(buildModelString('{{4,4,4},{-2,4,3}}', 2)).toBe('[4x^2 + 4xy + 4y^2 : -2x^2 + 4xy + 3y^2]');
  });

  test('returns an empty string when there is no degree', () => {
    expect(buildModelString('{{1,0,-1},{0,0,1}}', 0)).toBe('');
  });
});


// Splits only on commas outside { } braces
describe('splitOutermostCommas function', () => {
  test('splits correctly', () => {
    const input = '{x,y},{a,b}';
    const result = splitOutermostCommas(input);
    expect(result).toEqual(['{x,y}', '{a,b}']);
  });

  test('handles nested brackets', () => {
    const input = '{x,{y,z}},{a,b}';
    const result = splitOutermostCommas(input);
    expect(result).toEqual(['{x,{y,z}}', '{a,b}']);
  });
});


// Renders exponents like 'x^2' as superscripts
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
  // Real model string format: ("coefficients", resultant, "{bad primes}", height, field label)
  const mockData = {
    degree: 2,
    original_model: '("{{4,4,4},{-2,4,3}}",496,"{2,31}",1.3862944,1.1.1.1)',
  };

  test('renders without crashing', () => {
    render(<ModelsTable data={mockData} />);
    expect(screen.getByTestId('models-table')).toBeInTheDocument();
  });
});
