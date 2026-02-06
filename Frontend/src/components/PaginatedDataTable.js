import Pagination from 'react-bootstrap/Pagination';
export default function PaginatedDataTable({ labels, data, itemsPerPage, currentPage, setCurrentPage }) {

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem)

    const Superscript = ({ children }) => { // Component to render superscript text for exponents.
      return ( // Renders the children in a superscript style.
        <sup style={{ fontSize: '0.6em'}}>
          {children}
        </sup>
      );
    };
    
    const renderExponent = (exponent) => { // Function to format and render exponents in the table.
      const parts = exponent.split(/(\^[\d]+)/);
      const formattedExpression = [];

      for (let i = 0; i < parts.length; i++) {
        if (parts[i].startsWith('^')) {
          const exponentValue = parts[i].slice(1);
          formattedExpression.push(<Superscript key={i}>{exponentValue}</Superscript>);
        } else {
          formattedExpression.push(parts[i]);
        }
      }

      return formattedExpression; // Returns the formatted expression with superscripts.
    };
    
  const handlePageChange = (pageNumber) => { // Function to handle page changes in the pagination.
    if(pageNumber <= totalPages && pageNumber >= 1) {
	    setCurrentPage(pageNumber);
    }
  };

  return ( // Renders the paginated data table with navigation controls.
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
            <tr key={key} className={key % 2 === 0 ? 'even-row' : 'odd-row'} style={{ textAlign: 'center' }}>
              {item.map((element, id) => (
                <td key={id}>
                  <span>{id === 3 ? renderExponent(element) :element}</span>
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