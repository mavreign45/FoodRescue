import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Small data-loading hook used by the sample-data screens. It keeps loading,
 * empty and error handling consistent and will work unchanged when the
 * service layer is pointed at FastAPI.
 */
export function useAsyncData(loader, deps = []) {
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({
    status: "loading",
    data: null,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setState((previous) => ({
      status: previous.data ? "refreshing" : "loading",
      data: previous.data,
      error: null,
    }));

    Promise.resolve()
      .then(() => loaderRef.current({ signal: controller.signal }))
      .then((data) => {
        if (!active) return;
        setState({ status: "success", data, error: null });
      })
      .catch((error) => {
        if (!active || error.name === "AbortError") return;
        setState({ status: "error", data: null, error });
      });

    return () => {
      active = false;
      controller.abort();
    };
    // The caller controls re-fetching through its dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  return {
    ...state,
    isLoading: state.status === "loading",
    isRefreshing: state.status === "refreshing",
    retry,
  };
}
