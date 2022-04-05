export const timestamps = [
  '2021-02-02T10:00:00',
  '2021-02-02T10:05:00',
  '2021-02-02T10:10:00',
  '2021-02-02T10:15:00',
  '2021-02-02T10:20:00',
  '2021-02-02T10:25:00',
  '2021-02-02T10:30:00',
  '2021-02-02T10:35:00',
  '2021-02-02T10:40:00',
  '2021-02-02T10:45:00',
  '2021-02-02T10:50:00',
  '2021-02-02T10:55:00',
  '2021-02-02T11:00:00'
];

export const getPath = (step: number) => {
  return `/wms/?
    service=WMS&
    request=GetMap&
    version=1.1.1&
    format=image/png&
    layers=radar:5min&
    styles=radar-5min&
    transparent=false&
    height=256&
    width=256&
    srs=EPSG:3857&
    time=${timestamps[step]}&
    bbox={bbox-epsg-3857}
  `
}