import { Organisation } from "./organisationType";

export interface MonitoringNetwork {
  uuid: string;
  url: string;
  name: string;
  description: string;
  organisation: Organisation;
  access_modifier: string;
  num_timeseries: number;
  created: string;
  last_modified: string;
}
