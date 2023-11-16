import React, { useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';
export default function PaginatedDataTable({ labels, data, itemsPerPage }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if(pageNumber <= totalPages && pageNumber >= 1) {
	    setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <table id="resultstable" className="table table-sm table-bordered table-striped" style={{ width: '1000px' }}>
        <thead>
          <tr>
            {labels.map((label, index) => (
              <th key={index}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, key) => (
            <tr key={key} style={{ textAlign: 'center' }}>
              {item.map((element, id) => (
                <td key={id}>
                  <span>{element}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination size="lg" className="custom-pagination">
                <Pagination.Item onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                    {'<<'}
                </Pagination.Item>
                <Pagination.Item onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    {'<'}
                </Pagination.Item>

                {/* Current Page Number */}
                <Pagination.Item>{currentPage}</Pagination.Item>

                <Pagination.Item onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    {'>'}
                </Pagination.Item>
                <Pagination.Item onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                    {'>>'}
                </Pagination.Item>
        </Pagination>
    </>
  );
}

