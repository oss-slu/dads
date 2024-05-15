import React, { useRef, useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import Spinner from 'react-bootstrap/Spinner';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const PDFViewer = () => {
  const viewerRef = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [parentWidth, setParentWidth] = useState(null);

  useEffect(() => {
    if (viewerRef.current) {
      setParentWidth(viewerRef.current.offsetWidth);
    }
  }, []);

  const handleLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
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

export default PDFViewer;
