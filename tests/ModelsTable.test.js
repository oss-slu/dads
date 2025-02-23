import React from 'react';
import { renderExponent, processInput, splitOutermostCommas } from '../Frontend/src/components/FunctionDetail/ModelsTable';
import ModelsTable from '../Frontend/src/components/FunctionDetail/ModelsTable';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import { CssBaseline, StyledEngineProvider } from '@mui/material';

// const theme = createTheme();

describe('renderExponent function', () => {
  test('renders exponent correctly', () => {
    const { container } = render(<>{renderExponent(['x^2', 'y^3'])}</>);
    const textContent = container.textContent;  
    expect(textContent).toContain('x');
    expect(textContent).toContain('2');
    expect(textContent).toContain('y');
    expect(textContent).toContain('3');
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

// describe("ModelsTable snapshot test", () => {
//   test("renders correctly", () => {
//     const input = {
//       original_model: "{x^2, y^2}",
//       reduced_model: "{x^2, y^2}",
//       cp_field_of_defn: "1.1.1.1",
//       resultant: "1",
//       primes_of_bad_reduction: "{}",
//       conjugation_from_standard: ""
//     };
//     const tree = renderer
//     .create(
//       <StyledEngineProvider injectFirst>
//         <ThemeProvider theme={theme}>
//           <CssBaseline />
//           <ModelsTable data={input} />
//         </ThemeProvider>
//       </StyledEngineProvider>
//     ).toJSON();

//   expect(tree).toMatchSnapshot(); 
//   });
// });