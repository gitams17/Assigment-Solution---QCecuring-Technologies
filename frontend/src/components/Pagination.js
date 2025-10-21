import React from 'react';

function Pagination({ currentPage, totalPages, totalItems, onPageChange }) {
  return (
    <div className="table-footer">
      <div className="footer-info">
        Showing {Math.min((currentPage - 1) * 5 + 1, totalItems)} to {Math.min(currentPage * 5, totalItems)} of {totalItems} tasks
      </div>
      <div className="pagination">
        <button 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          &lt; Prev
        </button>
        <span>Page {currentPage}</span>
        <button 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
}

export default Pagination;