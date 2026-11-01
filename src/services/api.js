import { MASS_PAGE_SIZE, SINGLE_PAGE_SIZE } from "../config";

const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

const rawPath = (import.meta.env.VITE_SEARCH_PATH ?? "/search").trim().replace(/\/+$/, "");
const SEARCH_PATH = rawPath && !rawPath.startsWith("/") ? `/${rawPath}` : rawPath;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function readErrorMessage(response) {
  try {
    const body = await response.json();
    const detail = body?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail.map((item) => item.msg).filter(Boolean).join(". ");
    }
  } catch {
    // The body wasn't JSON; fall through to the generic message.
  }
  return `The API returned an error (${response.status}).`;
}

async function post(url, body, signal) {
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError(
      `Can't reach the API. Wait a bit?`,
    );
  }

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }
  return response.json();
}

/** POST {SEARCH_PATH}/ → { results, total, page, page_size } */
export function searchPage(query, versions, page, pageSize, signal) {
  return post(`${API_URL}${SEARCH_PATH}/`, { query, versions, page, page_size: pageSize }, signal);
}

/** First page of a single search. */
export function searchText(query, versions, signal) {
  return searchPage(query, versions, 1, SINGLE_PAGE_SIZE, signal);
}

/** POST {SEARCH_PATH}/mass_search → [{ query, response (first page), total }] */
export function massSearch(queries, versions, signal) {
  return post(
    `${API_URL}${SEARCH_PATH}/mass_search`,
    { queries, versions, page_size: MASS_PAGE_SIZE },
    signal,
  );
}
