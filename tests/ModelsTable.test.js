import React from 'react';
import { renderExponent, processInput, splitOutermostCommas } from '../Frontend/src/components/FunctionDetail/ModelsTable';
import ModelsTable from '../Frontend/src/components/FunctionDetail/ModelsTable';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('renderExponent function', () => {
  test('renders exponent correctly', () => {
    const result = renderExponent(['x^2', 'y^3']);
    expect(result.length).toBe(2);
  });
});

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

describe('ModelsTable function', () => {
    test('runs ModelsTable function without errors', () => {
        const input = {
            original_model: "{x^2,y^2}",
            reduced_model: "{x^2,y^2}",
            cp_field_of_defn: "1.1.1.1"
        };

        expect(() => ModelsTable({ data: input })).not.toThrow();
    });
});