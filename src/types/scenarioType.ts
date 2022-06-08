import { Organisation } from "./organisationType";

export interface Scenario {
  url: string;
  uuid: string;
  name: string;
  source: string;
  description: string;
  organisation: Organisation;
  access_modifier: string;
  last_modified: string;
  created: string;
  simulation_identifier: string;
  simulation_start: string;
  simulation_end: string;
  supplier: string;
  model_identifier: string;
  model_revision: string;
  model_name: string;
  has_raw_results: boolean;
  total_size: number;
  extra_metadata: Object;
  project: string;
}

export interface ScenarioResult {
  url: string;
  id: number;
  name: string;
  code: string;
  description: string;
  scenario: string;
  raster: string;
  attachment_url: string | null;
  family: "R" | "B" | "A" | "D";
}
