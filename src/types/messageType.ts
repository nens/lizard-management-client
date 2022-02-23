import { Organisation } from "./organisationType";

export interface Message {
  url: string,
  id: number,
  name: string,
  organisation: Organisation,
  type: string,
  subject: string,
  text: string,
  html: string,
  no_further_impact: boolean,
  created: string,
  last_modified: string
}