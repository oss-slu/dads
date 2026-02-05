import React, { useRef, useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import Spinner from 'react-bootstrap/Spinner';

pdfjs.GlobalWorkerOptions.workerSrc = new URL( // Sets the worker source for PDF.js to enable PDF rendering in the application.
  'pdfjs-dist/legacy/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const PDFViewer = () => { // Component to display a PDF document with responsive width and loading spinner.
  const viewerRef = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [parentWidth, setParentWidth] = useState(null);

  useEffect(() => {
    if (viewerRef.current) {
      setParentWidth(viewerRef.current.offsetWidth);
    }
  }, []);

  const handleLoadSuccess = ({ numPages }) => { // Callback function when the PDF document is successfully loaded.
    setNumPages(numPages);
  };

  return ( // Renders the PDF viewer with all pages of the document.
    <div ref={viewerRef}>
      <Document file="DynaBase_definitions.pdf" onLoadSuccess={handleLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={parentWidth}
            loading={<Spinner animation="grow" />}
          />
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer; // Exports the PDFViewer component for use in other parts of the application.
