import { useState } from "react";

import { MASS_PAGE_SIZE } from "../config";
import { ChevronIcon } from "./icons";
import PagedResults from "./PagedResults";

function MassResults({ groups, versions }) {
  // Only the first query starts open; the rest are one click away.
  const [collapsed, setCollapsed] = useState(() => new Set(groups.slice(1).map((group) => group.query)));

  const total = groups.reduce((sum, group) => sum + group.total, 0);
  const withMatches = groups.filter((group) => group.total > 0).length;
  const allCollapsed = collapsed.size === groups.length;

  const toggle = (query) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(query)) next.delete(query);
      else next.add(query);
      return next;
    });

  const jumpTo = (query, index) => {
    setCollapsed((prev) => {
      if (!prev.has(query)) return prev;
      const next = new Set(prev);
      next.delete(query);
      return next;
    });
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document
      .getElementById(`group-${index}`)
      ?.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <section aria-label="Mass search results">
      <div className="summary-row">
        <p className="results-summary" role="status">
          <strong>{total}</strong> {total === 1 ? "result" : "results"} across{" "}
          <strong>{groups.length}</strong> {groups.length === 1 ? "query" : "queries"}
          {withMatches < groups.length && <>, {groups.length - withMatches} without matches</>}
          {versions.length > 0 && <> in {versions.join(", ")}</>}
        </p>
        {groups.length > 1 && (
          <button
            type="button"
            className="text-button"
            onClick={() => setCollapsed(allCollapsed ? new Set() : new Set(groups.map((g) => g.query)))}
          >
            {allCollapsed ? "Expand all" : "Collapse all"}
          </button>
        )}
      </div>

      {groups.length > 1 && (
        <nav className="query-nav" aria-label="Jump to a query">
          {groups.map((group, index) => (
            <button
              key={group.query}
              type="button"
              className="query-nav-item"
              data-empty={group.total === 0}
              onClick={() => jumpTo(group.query, index)}
            >
              <span className="chip-text">{group.query}</span>
              <span className="query-nav-count">{group.total}</span>
            </button>
          ))}
        </nav>
      )}

      {groups.map((group, index) => {
        const open = !collapsed.has(group.query);
        const count = group.total;
        return (
          <section className="query-group" id={`group-${index}`} key={group.query}>
            <h2 className="group-heading">
              <button
                type="button"
                className="group-header"
                aria-expanded={open}
                aria-controls={`group-body-${index}`}
                onClick={() => toggle(group.query)}
              >
                <span className="group-chevron">
                  <ChevronIcon />
                </span>
                <span className="group-title">{group.query}</span>
                <span className="group-count">{count === 1 ? "1 result" : `${count} results`}</span>
              </button>
            </h2>

            <div id={`group-body-${index}`} hidden={!open}>
              {count === 0 ? (
                <p className="group-empty">
                  No matches{versions.length > 0 ? " in the selected versions" : ""}.
                </p>
              ) : (
                <PagedResults
                  firstPage={{ results: group.response, total: group.total }}
                  query={group.query}
                  versions={versions}
                  pageSize={MASS_PAGE_SIZE}
                />
              )}
            </div>
          </section>
        );
      })}
    </section>
  );
}

export default MassResults;
