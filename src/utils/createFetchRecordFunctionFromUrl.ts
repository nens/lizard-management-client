export const createFetchRecordFunctionFromUrl = (url: string) => {
  return (async ()=>{
    const group = await fetch(url, {
      credentials: "same-origin"
    });
    const parsed = await group.json();
    return parsed;
  })
}