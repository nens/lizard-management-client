import { useEffect, useState } from 'react';

interface InputProps {
  url: string | null;
}

interface Output {
  fetchingState: string | null;
  results: any[] | null;
  count: number;
}

export const usePaginatedFetch = (props: InputProps): Output => {
  const { url } = props;
  const [results, setResults] = useState<any[] | null>(null);
  const [count, setCount] = useState<number>(0);
  const [fetchingState, setFetchingState] = useState<string | null>(null);

  const resetAllState = () => {
    setResults(null);
    setFetchingState(null);
    setCount(0);
  };

  useEffect(() => {
    // Recursive function to fetch next URLs
    const fetchHelper = async (url: string | null) => {
      if (!url) return; // do nothing

      setFetchingState('FETCHING');
      try {
        const response = await fetch(url, {
          credentials: "same-origin"
        });

        if (response.status === 200) {
          const data = await response.json();
          setCount(data.count);
          setResults(results => results ? results.concat(data.results) : data.results);
          if (data.next) {
            fetchHelper(data.next.split("lizard.net")[1]);
          } else {
            // Finish building data based on the "next" param
            setFetchingState('DONE');
          };
          return data;
        } else {
          setFetchingState('FAILED');
          return console.error(`Failed to send GET request to ${url} with status: `, response.status);
        }
      } catch (e) {
        setFetchingState('FAILED');
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