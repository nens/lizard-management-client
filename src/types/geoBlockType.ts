export interface GeoBlockSource {
  name: string,
  graph: {
    [key: string]: (string | number)[]
  }
}