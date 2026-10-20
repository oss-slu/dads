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
import { Box } from '@mui/material';
import { get_rational_periodic_data, get_graph_data } from '../../api/routes';
import AdjacencyMatrix from '../FunctionDetail/AdjacencyMatrix';
import Copy from '../FunctionDetail/Copy';
import HelpBox from '../FunctionDetail/HelpBox';

const ScrollableTableContainer = styled(TableContainer)({
  maxHeight: '400px',
  overflowY: 'auto'
});

export default function RationalPointsTable({ data }) {
    const [rows, setRows] = useState([]);
    const [status, setStatus] = useState('loading'); // 'loading', 'loaded', 'error'
    
    const functionId = data?.function_id;

    const formatEdges = (edges) => {
      if (edges && edges.length > 0) {
        return Array.isArray(edges[0]) ? `[${edges[0].join(', ')}]` : `[${edges.join(', ')}]`
      }
    return '[]';
  };

  useEffect(() => {
    if (!functionId) return;
    let ignore = false;
    setStatus('loading');
    get_rational_periodic_data(functionId)
      .then(async (response) => {
        const records = response.data;
        const graphs = await Promise.all(
          records.map((r) => get_graph_data(r.graph_id).then((res) => res.data).catch(() => null))
        );
        if (ignore) return;
        setRows(records.map((r, i) => ({ ...r, graph: graphs[i] })));
        setStatus('loaded');
      })
      .catch((error) => {
        if (ignore) return;
        console.error('Error fetching rational periodic data:', error);
        setStatus('error');
      });
    return () => { ignore = true; };
  }, [functionId]);

  if (status === 'loading') return <p>Loading rational periodic data...</p>;
  if (status === 'error') return <p>Could not load rational preperiodic data.</p>;
  if (rows.length === 0) return <p>No rational preperiodic data for this system.</p>;
  
  return (
    <>
      <h3>Rational Points Table</h3>
      <ScrollableTableContainer component={Paper}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <Box display="inline-flex" alignItems="center" gap={0.5}>
                  <b>Field Label</b>
                  <HelpBox title="Field Label" description="An identifier representing the field extension the map is defined over, typically in a dot-separated form." />
                </Box>
              </TableCell>
              <TableCell>
                <Box display="inline-flex" alignItems="center" gap={0.5}>
                  <b>Cardinality</b>
                  <HelpBox title="Cardinality" description="The number of elements in the field over which the function is defined." />
                </Box>
              </TableCell>
              <TableCell>
                <Box display="inline-flex" alignItems="center" gap={0.5}>
                  <b>As Directed Graph</b>
                  <HelpBox title="As Directed Graph" description="Visual representation of the function as a directed graph showing how elements map under iteration." />
                </Box>
              </TableCell>
              <TableCell>
                <Box display="inline-flex" alignItems="center" gap={0.5}>
                  <b>Adjacency Matrix</b>
                  <HelpBox title="Adjacency Matrix" description="The matrix representation of the directed graph where each entry indicates an edge between nodes." />
                </Box>
              </TableCell>
              <TableCell>
                <Box display="inline-flex" alignItems="center" gap={0.5}>
                  <b>Cycle Lengths</b>
                  <HelpBox title="Cycle Lengths" description="Lengths of distinct cycles formed by rational periodic points under iteration." />
                </Box>
              </TableCell>
              <TableCell>
                <Box display="inline-flex" alignItems="center" gap={0.5}>
                  <b>Component Sizes</b>
                  <HelpBox title="Component Sizes" description="Sizes of connected components in the directed graph formed by the function." />
                </Box>
              </TableCell>
              <TableCell>
                <Box display="inline-flex" alignItems="center" gap={0.5}>
                  <b>Rational Preperiodic Points</b>
                  <HelpBox title="Rational Preperiodic Points" description="Points defined over the rational field that eventually become periodic under iteration, along with their preperiod lengths." />
                </Box>
              </TableCell>
              <TableCell>
                <Box display="inline-flex" alignItems="center" gap={0.5}>
                  <b>Longest Tail</b>
                  <HelpBox title="Longest Tail" description="The maximum preperiod length (number of steps before becoming periodic) among all preperiodic points." />
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((item) => {
              const meta = item.graph || {};
              const edges = formatEdges(meta.edges);
              const points = item.rational_periodic_points;

              return (
              <TableRow key={item.id}>
              <TableCell sx={{ width: '100px', maxWidth: '100px' }}><a
                  href={`https://www.lmfdb.org/NumberField/${item.base_field_label}`}
                  style={{
                    color: "blue",
                    textDecoration: "underline"
                  }}
                  target="_blank"
                  rel="noopener noreferrer">
                    {item.base_field_label}
                </a></TableCell>
              <TableCell sx={{ width: '60px', maxWidth: '60px', textAlign: 'center' }}>{meta.cardinality !== undefined && meta.cardinality !== null ? meta.cardinality : 'N/A'}</TableCell>
                            <TableCell sx={{ width: '200px', maxWidth: '200px' }}>
                {item.graph ? (
                  <Box display="flex" flexDirection="column" alignItems="flex-start" justifyContent="flex-start" gap={0.5} minWidth="200px">
                    <Copy edges={edges} type={2} size="small" sx={{ whiteSpace: 'nowrap' }} />
                  </Box>
                ) : 'N/A'}
              </TableCell>
              <TableCell sx={{ width: '200px', maxWidth: '200px' }}>
                {item.graph ? (
                  <Box display="flex" flexDirection="column" alignItems="flex-start" justifyContent="flex-start" gap={0.5} minWidth="200px">
                    <Copy edges={edges} type={1} size="small" sx={{ whiteSpace: 'nowrap' }} />
                    <AdjacencyMatrix modalTitle={'Adjacency Matrix'} edges={edges} size="small" sx={{ whiteSpace: 'nowrap' }} />
                  </Box>
                ) : 'N/A'}
              </TableCell>
              <TableCell sx={{ width: '100px', maxWidth: '100px' }}>{Array.isArray(meta.periodic_cycles) && meta.periodic_cycles.length > 0 ? `[${meta.periodic_cycles.join(', ')}]` : 'N/A'}</TableCell>
              <TableCell sx={{ width: '120px', maxWidth: '120px' }}>{Array.isArray(meta.preperiodic_components) && meta.preperiodic_components.length > 0 ? `[${meta.preperiodic_components.join(', ')}]` : 'N/A'}</TableCell>
              <TableCell sx={{ width: '100px', maxWidth: '100px' }}>
                {Array.isArray(points) && points.length > 0 ? (
                  points.map((point, idx) => <div key={idx}>{`(${point[0]} : ${point[1]})`}</div>)
                ) : ('N/A')}
              </TableCell>
              <TableCell sx={{ width: '60px', maxWidth: '60px', textAlign: 'center' }}>{meta.max_tail !== undefined && meta.max_tail !== null ? meta.max_tail : 'N/A'}</TableCell>
            </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollableTableContainer>
    </>
  );
}