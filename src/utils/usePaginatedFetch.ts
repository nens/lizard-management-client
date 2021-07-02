import { useEffect, useState } from 'react';

interface InputProps {
  url: string;
}

interface Output {
  fetchingState: string | null;
  results: any[];
  count: number;
}

export const usePaginatedFetch = (props: InputProps): Output => {
  const { url } = props;
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  const [fetchingState, setFetchingState] = useState<string | null>(null);

  useEffect(() => {
    // Recursive function to fetch next URLs
    const fetchHelper = async (url: string) => {
      setFetchingState('FETCHING');
      try {
        const response = await fetch(url, {
          credentials: "same-origin"
        });

        if (response.status === 200) {
          const data = await response.json();
          setCount(data.count);
          setResults(results => results.concat(data.results));
          if (data.next) {
            setNextUrl(data.next.split("lizard.net")[1]);
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

    fetchHelper(nextUrl || url);
  }, [url, nextUrl]);

  return {
    fetchingState: fetchingState,
    results: results,
    count: count,
  };
}