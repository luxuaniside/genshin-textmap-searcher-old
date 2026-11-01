import { useCallback, useEffect, useRef, useState } from "react";

const IDLE = { status: "idle", data: null, error: null, input: null, versions: [], runId: 0 };

/**
 * Runs one kind of search and tracks its state.
 * A newer search cancels the one still in flight.
 */
export function useSearchRun(request) {
  const [state, setState] = useState(IDLE);
  const abortRef = useRef(null);

  const run = useCallback(
    async (input, versions) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState((prev) => ({ ...IDLE, status: "loading", input, versions, runId: prev.runId }));

      try {
        const data = await request(input, versions, controller.signal);
        if (controller.signal.aborted) return;
        setState((prev) => ({
          status: "done",
          data,
          error: null,
          input,
          versions,
          runId: prev.runId + 1,
        }));
      } catch (error) {
        if (error.name === "AbortError") return;
        setState((prev) => ({ ...IDLE, status: "error", error, input, versions, runId: prev.runId }));
      }
    },
    [request],
  );

  useEffect(() => () => abortRef.current?.abort(), []);

  return { ...state, run };
}
