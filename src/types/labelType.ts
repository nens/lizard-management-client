import { Organisation } from "./organisationType";

export interface LabelType {
  url: string;
  uuid: string;
  name: string;
  description: string;
  organisation: Organisation;
  object_type: string;
  source: Object;
  access_modifier: string;
  last_modified: string;
  created: string;
}
