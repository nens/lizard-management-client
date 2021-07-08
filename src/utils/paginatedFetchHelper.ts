import { getRelativePathFromUrl } from "./getRelativePathFromUrl";

export const paginatedFetchHelper = async (url: string, previousResults: any[]): Promise<any> => {
  if (!url) return;

  try {
    const response = await fetch(url, { credentials: "same-origin" });
  
    if (response.status !== 200) {
      console.error(`Failed to send GET request to ${url} with status: `, response.status);
      return;
    };
  
    const data = await response.json();
    const results = previousResults.concat(data.results);
  
    if (data.next) {
      return await paginatedFetchHelper(getRelativePathFromUrl(data.next), results);
    };
  
    return results;
  } catch (e) {
    console.error(e);
  };
};