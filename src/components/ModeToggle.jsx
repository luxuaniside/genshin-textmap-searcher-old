const MODES = [
  { id: "single", label: "Single search" },
  { id: "mass", label: "Mass search" },
];

function ModeToggle({ mode, onChange }) {
  return (
    <div className="mode-toggle" role="group" aria-label="Search mode">
      {MODES.map((option) => (
        <button
          key={option.id}
          type="button"
          className="mode-option"
          aria-pressed={mode === option.id}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default ModeToggle;
