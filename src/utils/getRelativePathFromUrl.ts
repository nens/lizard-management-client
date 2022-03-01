export const getRelativePathFromUrl = (url: string) => {
  // Split the URL on "lizard.net" as it is contained in both nxt3.staging.lizard.net/api/v4
  // and demo.lizard.net/api/v4 to get the relative URL to the API (e.g. /api/v4/...)
  return url.split("lizard.net")[1];
};
