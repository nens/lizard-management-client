export const timestamps = [
  {
    time: '2021-02-02T10:00:00',
    loaded: false
  },
  {
    time: '2021-02-02T10:05:00',
    loaded: false
  },
  {
    time: '2021-02-02T10:10:00',
    loaded: false
  },
  {
    time: '2021-02-02T10:15:00',
    loaded: false
  },
  {
    time: '2021-02-02T10:20:00',
    loaded: false
  },
  {
    time: '2021-02-02T10:25:00',
    loaded: false
  },
  {
    time: '2021-02-02T10:30:00',
    loaded: false
  },
  {
    time: '2021-02-02T10:35:00',
    loaded: false
  },
  {
    time: '2021-02-02T10:40:00',
    loaded: false
  },
  {
    time: '2021-02-02T10:45:00',
    loaded: false
  }
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
    time=${timestamps[step].time}&
    bbox={bbox-epsg-3857}
  `
}