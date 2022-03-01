export async function simpleJSONFetch(url, method, body) {
  return await fetch(url, {
    credentials: "same-origin",
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}
