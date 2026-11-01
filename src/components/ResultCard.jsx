import { useEffect, useState } from "react";

import Highlight from "./Highlight";

function ResultCard({ result, term }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(String(result.id));
      setCopied(true);
    } catch {
      // Clipboard access can be blocked; the ID stays selectable text.
    }
  };

  return (
    <article className="result-card">
      <div className="result-meta">
        <button type="button" className="result-id" onClick={copyId} title="Copy ID">
          {copied ? "Copied" : result.id}
        </button>
        <span className="result-version">{result.version}</span>
        <span className="result-source">{result.text_source}</span>
      </div>

      <p className="result-english">
        {result.en ? <Highlight text={result.en} term={term} /> : <span className="result-missing">No English text</span>}
      </p>
      {result.chs && (
        <p className="result-chinese" lang="zh-Hans">
          <Highlight text={result.chs} term={term} />
        </p>
      )}
    </article>
  );
}

export default ResultCard;
