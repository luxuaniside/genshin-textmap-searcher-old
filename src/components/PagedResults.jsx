import { useEffect, useRef, useState } from "react";

import { searchPage } from "../services/api";
import Pagination from "./Pagination";
import ResultCard from "./ResultCard";

/**
 * One query's results, fetched a page at a time.
 * `firstPage` is the page the search already returned; later pages are
 * requested when needed and kept, so going back never refetches.
 * Remount it (via `key`) to start over.
 */
function PagedResults({ firstPage, query, versions, pageSize }) {
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState(null);
  const [failedPage, setFailedPage] = useState(null);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(firstPage.total);
  const [cache, setCache] = useState(() => new Map([[1, firstPage.results]]));

  const topRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const visible = cache.get(page) ?? [];
  const start = (page - 1) * pageSize;

  const goTo = async (next) => {
    abortRef.current?.abort();
    setError(null);
    setFailedPage(null);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    topRef.current?.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });

    if (cache.has(next)) {
      setPending(null);
      setPage(next);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setPending(next);

    try {
      const response = await searchPage(query, versions, next, pageSize, controller.signal);
      if (controller.signal.aborted) return;
      setCache((prev) => new Map(prev).set(next, response.results));
      setTotal(response.total);
      setPage(next);
      setPending(null);
    } catch (err) {
      if (err.name === "AbortError") return;
      setPending(null);
      setFailedPage(next);
      setError(err.message);
    }
  };

  return (
    <div ref={topRef} className="paged-results" aria-busy={pending !== null}>
      <ul className="result-list" data-loading={pending !== null}>
        {visible.map((result, index) => (
          <li key={`${start + index}:${result.id}:${result.version}:${result.text_source}`}>
            <ResultCard result={result} term={query} />
          </li>
        ))}
      </ul>

      {error && (
        <p className="inline-error" role="alert">
          Couldn't load page {failedPage}. {error}{" "}
          <button type="button" className="text-button" onClick={() => goTo(failedPage)}>
            Try again
          </button>
        </p>
      )}

      {pageCount > 1 && (
        <p className="range-label">
          Showing {start + 1} to {start + visible.length} of {total}
        </p>
      )}
      <Pagination page={pending ?? page} pageCount={pageCount} onChange={goTo} />
    </div>
  );
}

export default PagedResults;
