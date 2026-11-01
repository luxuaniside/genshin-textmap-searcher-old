import { useEffect, useId, useRef, useState } from "react";

import { VERSION_OPTIONS } from "../config";
import { ChevronIcon } from "./icons";

/** Multiselect dropdown for the versions to search in. Nothing selected means every version. */
function VersionSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Keep the selection in the same order as the list, whatever order it was clicked in.
  const toggle = (optionValue) => {
    const selected = new Set(value);
    if (selected.has(optionValue)) selected.delete(optionValue);
    else selected.add(optionValue);
    onChange(VERSION_OPTIONS.map((option) => option.value).filter((item) => selected.has(item)));
  };

  const labelFor = (optionValue) => VERSION_OPTIONS.find((o) => o.value === optionValue)?.label ?? optionValue;
  const summary = value.length ? value.map(labelFor).join(", ") : "All versions";

  return (
    <div className="version-select" ref={rootRef}>
      <button
        type="button"
        className="version-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="version-trigger-label">Versions</span>
        <span className="version-trigger-value" data-empty={value.length === 0}>
          {summary}
        </span>
        <span className="version-trigger-chevron" data-open={open}>
          <ChevronIcon />
        </span>
      </button>

      {open && (
        <div className="version-panel" id={panelId} role="group" aria-label="Versions to search in">
          {VERSION_OPTIONS.map((option) => (
            <label className="version-option" key={option.value}>
              <input
                type="checkbox"
                checked={value.includes(option.value)}
                onChange={() => toggle(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
          <div className="version-panel-footer">
            <span>{value.length === 0 ? "Searching all versions" : `${value.length} selected`}</span>
            <button type="button" className="text-button" disabled={value.length === 0} onClick={() => onChange([])}>
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VersionSelector;
