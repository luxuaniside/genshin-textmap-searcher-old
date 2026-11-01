import { getPageWindow } from "../lib/pageWindow";
import { ChevronIcon } from "./icons";

function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="page-button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronIcon direction="left" />
      </button>

      {getPageWindow(page, pageCount).map((item) =>
        typeof item === "number" ? (
          <button
            key={item}
            type="button"
            className="page-button"
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        ) : (
          <span key={item} className="page-gap" aria-hidden="true">
            …
          </span>
        ),
      )}

      <button
        type="button"
        className="page-button"
        aria-label="Next page"
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
      >
        <ChevronIcon direction="right" />
      </button>
    </nav>
  );
}

export default Pagination;
