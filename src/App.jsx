import { useMemo, useState } from "react";

import Header from "./components/Header";
import MassResults from "./components/MassResults";
import MassSearchForm from "./components/MassSearchForm";
import ModeToggle from "./components/ModeToggle";
import SingleResults from "./components/SingleResults";
import SingleSearchForm from "./components/SingleSearchForm";
import StatusMessage from "./components/StatusMessage";
import VersionSelector from "./components/VersionSelector";
import { useSearchRun } from "./hooks/useSearchRun";
import { massSearch, searchText } from "./services/api";

/** Orders the API's groups like the queries the user typed. Falls back to the page length if the API sends no total. */
function orderGroups(data, queries) {
  const position = (query) => {
    const index = queries.indexOf(query);
    return index === -1 ? queries.length : index;
  };
  return data
    .map((group) => ({ ...group, total: group.total ?? group.response.length }))
    .sort((a, b) => position(a.query) - position(b.query));
}

function App() {
  const [mode, setMode] = useState("single");
  const [versions, setVersions] = useState([]);
  const [singleText, setSingleText] = useState("");
  const [massText, setMassText] = useState("");

  const single = useSearchRun(searchText);
  const mass = useSearchRun(massSearch);

  const run = mode === "single" ? single : mass;

  const massGroups = useMemo(
    () => (mass.status === "done" ? orderGroups(mass.data, mass.input) : []),
    [mass.status, mass.data, mass.input],
  );

  const renderResults = () => {
    switch (run.status) {
      case "loading":
        return <StatusMessage busy title="Searching…" />;
      case "error":
        return <StatusMessage tone="error" title="The search failed">{run.error.message}</StatusMessage>;
      case "done":
        return mode === "single" ? (
          <SingleResults key={run.runId} firstPage={run.data} query={run.input} versions={run.versions} />
        ) : (
          <MassResults key={run.runId} groups={massGroups} versions={run.versions} />
        );
      default:
        return mode === "single" ? (
          <StatusMessage title="Search the textmap">
            Type a name or a line of dialogue to see every place it appears, in English and in the original Chinese.
          </StatusMessage>
        ) : (
          <StatusMessage title="Search several things at once">
            List the names you want to check, separated by commas. Each one gets its own group of results.
          </StatusMessage>
        );
    }
  };

  return (
    <main className="min-h-screen px-5 py-3">
      <div className="app-shell">
        <Header />

        <ModeToggle mode={mode} onChange={setMode} />

        <div className="search-area">
          {mode === "single" ? (
            <SingleSearchForm
              value={singleText}
              onChange={setSingleText}
              onSubmit={(query) => single.run(query, versions)}
              loading={single.status === "loading"}
            />
          ) : (
            <MassSearchForm
              value={massText}
              onChange={setMassText}
              onSubmit={(queries) => mass.run(queries, versions)}
              loading={mass.status === "loading"}
            />
          )}
          <VersionSelector value={versions} onChange={setVersions} />
        </div>

        <div className="results-area">{renderResults()}</div>
      </div>
    </main>
  );
}

export default App;
