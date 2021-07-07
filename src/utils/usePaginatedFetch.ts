import { useEffect, useState } from 'react';
import { DataRetrievalState } from '../types/retrievingDataTypes';
import { getRelativePathFromUrl } from './getRelativePathFromUrl';

interface InputProps {
  url: string | null;
}

interface Output {
  fetchingState: DataRetrievalState;
  results: any[] | null;
  count: number;
}

export const usePaginatedFetch = (props: InputProps): Output => {
  const { url } = props;
  const [results, setResults] = useState<any[] | null>(null);
  const [count, setCount] = useState<number>(0);
  const [fetchingState, setFetchingState] = useState<DataRetrievalState>('NEVER_DID_RETRIEVE');

  const resetAllState = () => {
    setResults(null);
    setFetchingState('NEVER_DID_RETRIEVE');
    setCount(0);
  };

  useEffect(() => {
    // Recursive function to fetch next URLs
    const fetchHelper = async (url: string | null) => {
      if (!url) return; // do nothing

      setFetchingState('RETRIEVING');
      try {
        const response = await fetch(url, {
          credentials: "same-origin"
        });

        if (response.status === 200) {
          const data = await response.json();
          setCount(data.count);
          setResults(results => results ? results.concat(data.results) : data.results);
          if (data.next) {
            fetchHelper(getRelativePathFromUrl(data.next));
          } else {
            // Finish building data based on the "next" param
            setFetchingState('RETRIEVED');
          };
          return data;
        } else {
          setFetchingState({
            status: "ERROR",
            errorMesssage: `Failed to send GET request to ${url} with status: ${response.status}`,
            url: url
          });
          return console.error(`Failed to send GET request to ${url} with status: `, response.status);
        }
      } catch (e) {
        setFetchingState({
          status: "ERROR",
          errorMesssage: e,
          url: url
        });
        return console.error(e);
      };
    };

    fetchHelper(url);
    return () => resetAllState();
  }, [url]);

  return {
    fetchingState: fetchingState,
    results: results,
    count: count,
  };
}