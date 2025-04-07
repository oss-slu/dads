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
import { get_rational_periodic_data, get_label, get_graph_metadata } from '../../api/routes';
import AdjacencyMatrix from '../FunctionDetail/AdjacencyMatrix';
import Copy from '../FunctionDetail/Copy';

const ScrollableTableContainer = styled(TableContainer)({
  maxHeight: '400px',
  overflowY: 'auto'
});

export default function RationalPointsTable({ data }) {
  const [rationalData, setRationalData] = useState([]);
  const [label, setLabel] = useState('');
  const [graphMetaMap, setGraphMetaMap] = useState({});

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
        .then(async response => {
          const rawData = response.data;
          console.log("Rational Periodic Data:", rawData);
          setRationalData(rawData);

          const metaMap = {};
          for (const item of rawData) {
            const graphId = item[4];
            console.log("Graph ID extracted:", graphId);
            try {
              const metaResponse = await get_graph_metadata(graphId);
              console.log(`Metadata for graph_id ${graphId}:`, metaResponse.data, Object.keys(metaResponse.data));
              metaMap[graphId] = metaResponse.data;
            } catch (error) {
              console.error(`Error fetching metadata for graph_id ${graphId}:`, error);
            }
          }
          console.log("Final graphMetaMap:", metaMap);
          setGraphMetaMap(metaMap);
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
            {rationalData.map((item, index) => {
              const graphId = item[4];
              const meta = graphMetaMap[graphId] || {};

              console.log(`Rendering row ${index} for graphId ${graphId}`, meta);

              return (
                <TableRow key={index}>
                  <TableCell>{item[2]}</TableCell>
                  <TableCell>{meta.cardinality !== undefined && meta.cardinality !== null ? meta.cardinality : 'N/A'}</TableCell>
                  <TableCell><Copy edges={formatData("edges")} type={2} /></TableCell>
                  <TableCell>
                    <AdjacencyMatrix modalTitle={"Adjacency Matrix"} edges={formatData("edges")} />
                    <Copy edges={formatData("edges")} type={1} />
                  </TableCell>
                  <TableCell>{Array.isArray(meta.periodic_cycles) && meta.periodic_cycles.length > 0 ? `[${meta.periodic_cycles.join(', ')}]` : 'N/A'}</TableCell>
                  <TableCell>{Array.isArray(meta.preperiodic_components) && meta.preperiodic_components.length > 0 ? `[${meta.preperiodic_components.join(', ')}]` : 'N/A'}</TableCell>
                  <TableCell>
                    {item[3].map((point, idx) => (
                      <div key={idx}>{`(${point[0]}, ${point[1]})`}</div>
                    ))}
                  </TableCell>
                  <TableCell>{meta.max_tail !== undefined && meta.max_tail !== null ? meta.max_tail : 'N/A'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollableTableContainer>
    </>
  );
}
