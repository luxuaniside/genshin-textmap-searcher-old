import { useMemo } from "react";

import { formatQueries, parseQueries } from "../lib/parseQueries";
import { CloseIcon } from "./icons";

const MAX_CHIPS = 10;

function MassSearchForm({ value, onChange, onSubmit, loading }) {
  const queries = useMemo(() => parseQueries(value), [value]);
  const count = queries.length;

  const submit = (event) => {
    event.preventDefault();
    if (count) onSubmit(queries);
  };

  const removeQuery = (target) => onChange(formatQueries(queries.filter((query) => query !== target)));

  const handleKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") submit(event);
  };

  return (
    <form onSubmit={submit}>
      <textarea
        className="mass-input"
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={"Naberius, Ronova, Istaroth, Asmoday, Phanes"}
        aria-label="Texts to search for, separated by commas"
        spellCheck={false}
        autoFocus
      />
      <p className="field-hint">
        Separate queries with commas or new lines. To search for text that contains a comma, write{" "}
        <code className="inline-code">\,</code> instead.
      </p>

      {count > 0 && (
        <ul className="chip-list" aria-label="Queries that will be searched">
          {queries.slice(0, MAX_CHIPS).map((query) => (
            <li className="chip" key={query}>
              <span className="chip-text">{query}</span>
              <button
                type="button"
                className="chip-remove"
                aria-label={`Remove ${query}`}
                onClick={() => removeQuery(query)}
              >
                <CloseIcon />
              </button>
            </li>
          ))}
          {count > MAX_CHIPS && <li className="chip-more">and {count - MAX_CHIPS} more</li>}
        </ul>
      )}

      <div className="form-footer">
        <span className="field-hint">{count === 1 ? "1 query" : `${count} queries`}</span>
        <button className="action-button" type="submit" disabled={loading || !count}>
          Search all
        </button>
      </div>
    </form>
  );
}

export default MassSearchForm;
