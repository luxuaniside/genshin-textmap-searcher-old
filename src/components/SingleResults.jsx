import { SINGLE_PAGE_SIZE } from "../config";
import PagedResults from "./PagedResults";
import StatusMessage from "./StatusMessage";

function SingleResults({ firstPage, query, versions }) {
  const { total } = firstPage;
  const filtered = versions.length > 0;

  if (total === 0) {
    return (
      <StatusMessage title={`No results for “${query}”`}>
        {filtered
          ? "Try a shorter phrase, or remove the version filter."
          : "Try a shorter phrase or a different spelling."}
      </StatusMessage>
    );
  }

  return (
    <section aria-label="Search results">
      <p className="results-summary" role="status">
        <strong>{total}</strong> {total === 1 ? "result" : "results"} for “{query}”
        {filtered && <> in {versions.join(", ")}</>}
      </p>
      <PagedResults firstPage={firstPage} query={query} versions={versions} pageSize={SINGLE_PAGE_SIZE} />
    </section>
  );
}

export default SingleResults;
