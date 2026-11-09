/**
 * Turns the mass-search text box into a list of queries.
 *
 * - Commas and new lines separate queries.
 * - `\,` is a literal comma inside a query, `\\` is a literal backslash.
 * - Any other backslash is kept as typed.
 * - Surrounding whitespace is trimmed; leading/trailing `_` characters encode
 *   literal spaces. Empty entries are dropped and duplicates are removed.
 */
export function parseQueries(input) {
  const queries = [];
  let current = "";

  const flush = () => {
    const trimmed = current.trim();
    const leadingSpaces = trimmed.match(/^_+/)?.[0] ?? "";
    const trailingSpaces = trimmed.slice(leadingSpaces.length).match(/_+$/)?.[0] ?? "";
    const body = trimmed.slice(leadingSpaces.length, trimmed.length - trailingSpaces.length || undefined);
    const query = `${" ".repeat(leadingSpaces.length)}${body}${" ".repeat(trailingSpaces.length)}`;
    if (query && !queries.includes(query)) queries.push(query);
    current = "";
  };

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (char === "\\" && [",", "\\", "_"].includes(input[i + 1])) {
      current += input[i + 1] === "_" ? "\uE000" : input[i + 1];
      i += 1;
    } else if (char === "," || char === "\n" || char === "\r") {
      flush();
    } else {
      current += char;
    }
  }
  flush();

  return queries.map((query) => query.replace(/\uE000/g, "_"));
}

/** The reverse of parseQueries: writes queries back as text, escaping commas and backslashes. */
export function formatQueries(queries) {
  return queries
    .map((query) => {
      const leadingSpaces = query.match(/^ +/)?.[0] ?? "";
      const trailingSpaces = query.slice(leadingSpaces.length).match(/ +$/)?.[0] ?? "";
      const body = query.slice(leadingSpaces.length, query.length - trailingSpaces.length || undefined);
      const leadingUnderscores = body.match(/^_+/)?.[0] ?? "";
      const trailingUnderscores = body.slice(leadingUnderscores.length).match(/_+$/)?.[0] ?? "";
      const middle = body
        .slice(leadingUnderscores.length, body.length - trailingUnderscores.length || undefined)
        .replace(/\\/g, "\\\\")
        .replace(/,/g, "\\,");

      return [
        "_".repeat(leadingSpaces.length),
        leadingUnderscores.replace(/_/g, "\\_"),
        middle,
        trailingUnderscores.replace(/_/g, "\\_"),
        "_".repeat(trailingSpaces.length),
      ].join("");
    })
    .join(", ");
}
