/**
 * Turns the mass-search text box into a list of queries.
 *
 * - Commas and new lines separate queries.
 * - `\,` is a literal comma inside a query, `\\` is a literal backslash.
 * - Any other backslash is kept as typed.
 * - Whitespace is trimmed, empty entries are dropped, duplicates are removed.
 */
export function parseQueries(input) {
  const queries = [];
  let current = "";

  const flush = () => {
    const query = current.trim();
    if (query && !queries.includes(query)) queries.push(query);
    current = "";
  };

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (char === "\\" && (input[i + 1] === "," || input[i + 1] === "\\")) {
      current += input[i + 1];
      i += 1;
    } else if (char === "," || char === "\n" || char === "\r") {
      flush();
    } else {
      current += char;
    }
  }
  flush();

  return queries;
}

/** The reverse of parseQueries: writes queries back as text, escaping commas and backslashes. */
export function formatQueries(queries) {
  return queries.map((query) => query.replace(/\\/g, "\\\\").replace(/,/g, "\\,")).join(", ");
}
