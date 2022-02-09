export const createFetchRecordFunctionFromUrl = (url: string) => {
  return (async ()=>{
    const apiResult = await fetch(url, {
      credentials: "same-origin"
    });
    const parsed = await apiResult.json();
    return parsed;
  })
}