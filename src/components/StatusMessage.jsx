function StatusMessage({ tone = "neutral", title, children, busy = false }) {
  return (
    <div className="status-card" data-tone={tone} role={tone === "error" ? "alert" : "status"}>
      {busy && <div className="spinner" aria-hidden="true" />}
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

export default StatusMessage;
