import React, { useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';
import 'bootstrap/dist/css/bootstrap.css';

export default function PaginatedDataTable({ labels, data, itemsPerPage }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <table id="resultstable" className="table table-sm table-bordered table-striped" style={{ width: '700px' }}>
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
      <Pagination size="lg">
        <Pagination.First onClick={() => handlePageChange(1)} />
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
        {[...Array(totalPages).keys()].map((pageNumber) => (
          <Pagination.Item key={pageNumber} active={pageNumber + 1 === currentPage} onClick={() => handlePageChange(pageNumber + 1)}>
            {pageNumber + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
        <Pagination.Last onClick={() => handlePageChange(totalPages)} />
      </Pagination>
    </>
  );
}

