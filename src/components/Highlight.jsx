const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Renders `text` with every occurrence of `term` wrapped in <mark>. */
function Highlight({ text, term }) {
  const needle = term?.trim();
  if (!text || !needle) return text ?? null;

  // The capture group makes split() keep the matches, at the odd indices.
  const parts = text.split(new RegExp(`(${escapeRegExp(needle)})`, "gi"));
  return parts.map((part, index) => (index % 2 === 1 ? <mark key={index}>{part}</mark> : part));
}

export default Highlight;
