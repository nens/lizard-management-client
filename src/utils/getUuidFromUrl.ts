export const getUuidFromUrl = (url: string) => {
  // The UUID is the last part of the URL
  if (url.charAt(url.length -1) !== '/') {
    // Make sure it ends with '/'
    url += '/';
  }
  const urlParts = url.split('/');
  // Parts is at least length 2 because we know there is a / in the string
  // Return next to last element
  return urlParts[urlParts.length - 2];
};