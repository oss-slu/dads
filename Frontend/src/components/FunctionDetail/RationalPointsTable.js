import * as React from 'react';
import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { get_rational_periodic_data, get_label } from '../../api/routes';
import AdjacencyMatrix from '../FunctionDetail/AdjacencyMatrix'
import Copy from '../FunctionDetail/Copy'

const ScrollableTableContainer = styled(TableContainer)({
  maxHeight: '400px',
  overflowY: 'auto'
});

export default function RationalPointsTable({ data }) {
  const [rationalData, setRationalData] = useState([]);
  const [label, setLabel] = useState('');

  const functionId = data?.function_id;

  const formatData = (key) => {
    const items = data[key];
    if (items && items.length > 0) {
      if (Array.isArray(items[0])) {
        return `[${items[0].join(', ')}]`;
      } else {
        return `[${items.join(', ')}]`;
      }
    }
    return '[]';
  };

  useEffect(() => {
    if (functionId) {
      get_rational_periodic_data(functionId)
        .then(response => {
          console.log("Rational Periodic Data Response:", response.data);
          setRationalData(response.data);
        })
        .catch(error => {
          console.error("Error fetching rational periodic data:", error);
        });

      get_label(functionId)
        .then(response => {
          setLabel(response.data.label);
        })
        .catch(error => {
          console.error("Error fetching label:", error);
        });
    }
  }, [functionId]);

  if (!rationalData.length) return <p>Loading rational periodic data...</p>;

  return (
    <>
      <h3>Rational Points Table</h3>
      <ScrollableTableContainer component={Paper}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><b>Field Label</b></TableCell>
              <TableCell><b>Cardinality</b></TableCell>
              <TableCell><b>As Directed Graph</b></TableCell>
              <TableCell><b>Adjacency Matrix</b></TableCell>
              <TableCell><b>Cycle Lengths</b></TableCell>
              <TableCell><b>Component Sizes</b></TableCell>
              <TableCell><b>Rational Preperiodic Points</b></TableCell>
              <TableCell><b>Longest Tail</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rationalData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item[2]}</TableCell> {/* Field Label */}
                <TableCell>{data.cardinality}</TableCell> {/* Cardinality */}
                <TableCell><Copy edges={formatData("edges")} type={2} /></TableCell> {/* As Directed Graph */}
                <TableCell>
                  <AdjacencyMatrix modalTitle={"Adjacency Matrix"} edges={formatData("edges")} />
                  <Copy edges={formatData("edges")} type={1} />
                </TableCell> {/* Adjacency Matrix */}
                <TableCell>{formatData("periodic_cycles")}</TableCell> {/* Cycle Lengths */}
                <TableCell>{formatData("preperiodic_components")}</TableCell> {/* Component Sizes */}
                <TableCell>
                  {item[3].map((point, idx) => (
                    <div key={idx}>{`(${point[0]}, ${point[1]})`}</div>
                  ))}
                </TableCell>
                <TableCell>{item[4]}</TableCell> {/* Longest Tail */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollableTableContainer>
    </>
  );
}
