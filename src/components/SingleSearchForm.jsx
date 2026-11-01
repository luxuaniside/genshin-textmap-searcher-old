import { SearchIcon } from "./icons";

function SingleSearchForm({ value, onChange, onSubmit, loading }) {
  const query = value.trim();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (query) onSubmit(query);
  };

  return (
    <form className="single-form" role="search" onSubmit={handleSubmit}>
      <input
        className="search-input"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Hyperborea"
        aria-label="Text to search for"
        autoComplete="off"
        autoFocus
      />
      <button className="search-button" type="submit" aria-label="Search" disabled={loading || !query}>
        <SearchIcon />
      </button>
    </form>
  );
}

export default SingleSearchForm;
