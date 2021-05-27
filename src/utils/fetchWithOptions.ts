export const fetchWithOptions = (
  baseUrl: string,
  uuids: string[],
  fetchOptions: RequestInit
) => {
  const fetches = uuids.map (uuid => {
    return fetch(baseUrl + uuid + "/", fetchOptions);
  });
  return Promise.all(fetches)
};