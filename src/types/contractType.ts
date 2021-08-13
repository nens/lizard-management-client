// not yet used
export interface Contract {
  url: string,
    uuid: string,
    organisation: {
        url: string,
        uuid: string,
        name: string
    },
    start: string,
    raster_storage_capacity: number,
    scenario_storage_capacity: number,
    timeseries_storage_capacity: number,
    asset_capacity: number,
    label_capacity: number,
    event_capacity: number,
    alarm_message_capacity: number,
    geoblocks_acces: boolean,
    geoblocks_calculation_units_capacity: number,
    links: string[]
}