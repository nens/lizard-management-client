import { Organisation } from "./organisationType";

export interface Scenario {
  url: string;
  uuid: string;
  name: string;
  organisation: Organisation;
  access_modifier: string;
  last_modified: string;
  created: string;
  simulation_id: number;
  start_time_sim: string;
  end_time_sim: string;
  username: string;
  for_icms: boolean;
  model_url: string;
  model_revision: string;
  model_name: string;
  has_raw_results: boolean;
  total_size: number;
}
