import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="Paginación del catálogo">
      <p className="pagination__status">
        Página <strong>{currentPage}</strong> de {totalPages}
      </p>

      <div className="pagination__controls">
        <button
          type="button"
          className="pagination__arrow"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          <span aria-hidden="true">←</span>
        </button>

        <ul className="pagination__pages">
          {pages.map((page) => (
            <li key={page}>
              <button
                type="button"
                className={
                  page === currentPage
                    ? 'pagination__page pagination__page--active'
                    : 'pagination__page'
                }
                onClick={() => onPageChange(page)}
                aria-current={page === currentPage ? 'page' : undefined}
                aria-label={`Ir a la página ${page}`}
              >
                {page}
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="pagination__arrow"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Página siguiente"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </nav>
  );
}
