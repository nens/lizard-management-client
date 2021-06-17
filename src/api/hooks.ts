import { useState } from 'react';
import { QueryClient, useQuery, useQueryClient } from 'react-query';

export type Params = Record<string, string|number>;

// Query client is set using the global provider in App.js!
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: false as const,
      refetchOnMount: false as const,
      // @ts-ignore
      refetchOnWindowsFocus: false as const,
      refetchOnReconnect: true as const,
      refetchIntervalInBackground: true as const,
      refetchInterval: false as const,
    }
  }
});

export function combineUrlAndParams(url: string, params: Params) {
  let query = Object.keys(params).map(
    k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
  ).join('&');

  if (query) {
    if (url.indexOf('?') >= 0) {
      return url + '&' + query;
    } else {
      return url + '?' + query;
    }
  }
  return url;
}

// Error to throw if status code isn't 2xx
export class FetchError extends Error {
  constructor(public res: Response, message?: string) {
    super(message)
  }
}

export async function basicFetchFunction(
  baseUrl: string,
  params: Params
) {
  const response = await fetch(combineUrlAndParams(baseUrl, params), {
    method: 'GET',
    credentials: "same-origin",
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
  });

  if (response.ok) {
    const json = await response.json();

    let nextUrl = json.next;
    let previousUrl = json.previous;
    // This hack is for development; turn absolute URLs into local ones.
    if (nextUrl) {
      nextUrl = nextUrl.split('lizard.net')[1];
    }
    if (previousUrl) {
      previousUrl = previousUrl.split('lizard.net')[1];
    }
    // This is how Lizard API v4 formats list responses.
    return {
      nextUrl,
      previousUrl,
      data: json.results
    };
  } else {
    throw new FetchError(response, `Received status: ${response.status}`)
  }
}


export function useTableData(baseUrl: string, params: Params, fetchFunction: typeof basicFetchFunction = basicFetchFunction) {
  const queryClient = useQueryClient();
  const [currentUrl, setCurrentUrl] = useState<string|null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(10);

  const paginatedParams = {
    ...params,
    page_size: currentPageSize,
    page: currentPage
  }

  // Use a combined key that always has the same baseUrl, so we can invalidate all
  // versions at once. If using next/previous pagination, use the full URL as the
  // second part on later pages, otherwise make a string of the params.
  const fetchKey = [baseUrl, currentUrl || paginatedParams];

  let queryFunction = (
    currentUrl ? () => basicFetchFunction(currentUrl, {}) : () => fetchFunction(baseUrl, paginatedParams));

  const query = useQuery(fetchKey, queryFunction);

  const status = query.status; // 'loading', 'error', or 'success'
  const data = status === 'success' ? query.data! : {data: undefined, nextUrl: undefined, previousUrl: undefined};

  const setPage = (page: number) => {
    setCurrentPage(page);
    setCurrentUrl(null);
  };

  const setPageSize = (pageSize: number) => {
    setCurrentPageSize(pageSize);
    setCurrentPage(1);
    setCurrentUrl(null);
  };

  // This lacks a way to notice that we reached the end of the data
  // use count in some way for non-nextUrl pagination.
  const nextPage = (
    data.nextUrl ?
      () => setCurrentUrl(data.nextUrl) :
      () => setPage(currentPage + 1)
  );
  const previousPage = (
    data.previousUrl ?
      () => setCurrentUrl(data.previousUrl) :
      currentPage > 1 ? () => setPage(currentPage - 1) : undefined);

  // Return response and a set of useful functions for paginations and resetting
  return {
    status: query.status, // 'loading', 'error', or 'success'
    tableData: query.status === 'success' ? query.data.data : [],
    error: query.status === 'error' ? query.error : null,

    setPage,
    pageSize: currentPageSize,
    setPageSize,
    nextPage,
    previousPage,
    firstPage: () => setPage(1),
    reload: () => {
      // Invalidate all queries with a key that starts with this
      queryClient.invalidateQueries(baseUrl)
    },
    reloadToFirstPage: () => {
      queryClient.invalidateQueries(baseUrl);
      setPage(1);
    }
  }
}
