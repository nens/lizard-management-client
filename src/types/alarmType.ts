import { Point } from "geojson";
import { Organisation } from "./organisationType";

export interface Alarm {
  url: string;
  uuid: string;
  name: string;
  organisation: Organisation;
  active: boolean;
  repeat_triggers: boolean;
  snooze_sign_on: number;
  snooze_sign_off: number;
  comparison: string;
  relative_start: string;
  relative_end: string;
  messages: {
    message: string;
    contact_group: string;
  }[];
  thresholds: {
    value: number;
    warning_level: string;
  }[];
}

export interface RasterAlarm extends Alarm {
  geometry: Point;
  raster: string;
}

export interface TimeseriesAlarm extends Alarm {
  timeseries: string;
}
