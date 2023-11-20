import {
    MaterialReactTable,
    useMaterialReactTable,
  } from 'material-react-table';
  import { useState, useEffect, useMemo } from 'react';
  const columns = [
      { 
        header: 'Label',
        accessorKey: 'label', 
      },
      {
        header: 'Domain',
        accessorKey: 'domain',  
      },
      {
          header:'Degree',
          accessorKey:'degree',
      },
      {
          header:'Polynomials',
          accessorKey:'polynomials',
      },
      {
          header:'Field',
          accessorKey:'field',
      }
      // etc for other columns
    ]
  const PaginatedTable = (props) => {
    const data = useMemo(() => (
      props.systemsdata.map((innerArray) => ({
        label: innerArray[0],
        domain: innerArray[1],
        degree: innerArray[2],
        polynomials: innerArray[3],
        field: innerArray[4],
      }))
    ), [props.systemsdata]);
    const table = useMaterialReactTable({
      columns,
      data,
      muiPaginationProps: {
        color: 'primary',
        shape: 'rounded',
        showRowsPerPage: true,
        variant: 'outlined',
      },
      paginationDisplayMode: 'pages',
    });
  
    return <MaterialReactTable table={table} />;
  };
  
  export default PaginatedTable;
  