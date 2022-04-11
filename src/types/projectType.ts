import { Organisation } from "./organisationType";

export interface Project {
  url: string;
  uuid: string;
  name: string;
  organisation: Organisation;
  access_modifier: string;
  last_modified: string;
  created: string;
  code: string;
  description: string;
  scheduled_for_deletion: boolean;
  supplier: string;
}
