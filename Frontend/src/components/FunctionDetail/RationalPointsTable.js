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
import HelpBox from '../FunctionDetail/HelpBox';

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
          setRationalData(rawData);

          const metaMap = {};
          for (const item of rawData) {
            const graphId = item[4];
            try {
              const metaResponse = await get_graph_metadata(graphId);
              metaMap[graphId] = metaResponse.data;
            } catch (error) {
              console.error(`Error fetching metadata for graph_id ${graphId}:`, error);
            }
          }
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
              <TableCell>
                <b>Field Label</b>
                <HelpBox title="Field Label" description="An identifier representing the field extension the map is defined over, typically in a dot-separated form." />
              </TableCell>
              <TableCell>
                <b>Cardinality</b>
                <HelpBox title="Cardinality" description="The number of elements in the field over which the function is defined." />
              </TableCell>
              <TableCell>
                <b>As Directed Graph</b>
                <HelpBox title="As Directed Graph" description="Visual representation of the function as a directed graph showing how elements map under iteration." />
              </TableCell>
              <TableCell>
                <b>Adjacency Matrix</b>
                <HelpBox title="Adjacency Matrix" description="The matrix representation of the directed graph where each entry indicates an edge between nodes." />
              </TableCell>
              <TableCell>
                <b>Cycle Lengths</b>
                <HelpBox title="Cycle Lengths" description="Lengths of distinct cycles formed by rational periodic points under iteration." />
              </TableCell>
              <TableCell>
                <b>Component Sizes</b>
                <HelpBox title="Component Sizes" description="Sizes of connected components in the directed graph formed by the function." />
              </TableCell>
              <TableCell>
                <b>Rational Preperiodic Points</b>
                <HelpBox title="Rational Preperiodic Points" description="Points defined over the rational field that eventually become periodic under iteration, along with their preperiod lengths." />
              </TableCell>
              <TableCell>
                <b>Longest Tail</b>
                <HelpBox title="Longest Tail" description="The maximum preperiod length (number of steps before becoming periodic) among all preperiodic points." />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rationalData.map((item, index) => {
              const graphId = item[4];
              const meta = graphMetaMap[graphId] || {};

              return (
                <TableRow key={index}>
                  <TableCell>{item[2]}</TableCell>
                  <TableCell>{meta.cardinality !== undefined && meta.cardinality !== null ? meta.cardinality : 'N/A'}</TableCell>
                  <TableCell><Copy edges={formatData("edges")} type={2} /></TableCell>
                  <TableCell>
                    <AdjacencyMatrix modalTitle={"Adjacency Matrix"} edges={formatData("edges")} />
                  </TableCell>
                  <TableCell>{Array.isArray(meta.periodic_cycles) && meta.periodic_cycles.length > 0 ? `[${meta.periodic_cycles.join(', ')}]` : 'N/A'}</TableCell>
                  <TableCell>{Array.isArray(meta.preperiodic_components) && meta.preperiodic_components.length > 0 ? `[${meta.preperiodic_components.join(', ')}]` : 'N/A'}</TableCell>
                  <TableCell>
                    {Array.isArray(item[3]) && item[3].length > 0 ? (item[3].map((point, idx) => (
                        <div key={idx}>{`(${point[0]}, ${point[1]})`}</div>
                      ))
                    ) : ('N/A')}
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