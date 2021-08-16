export const bytesToDisplayValue = (bytes:number) => {
  const mb = bytes / 1048576;
  const gb = bytes / 1073741824;
  if (bytes >= 0) {
    if (gb > 0.01) {
      return gb.toFixed(2) + ' Gb';
    } else if (mb > 0.01) {
      return mb.toFixed(2) + ' Mb'
    } else {
      return bytes+' Bytes'
    }
  } else {
    if (gb < -0.01) {
      return gb.toFixed(2) + ' Gb';
    } else if (mb < 0.01) {
      return mb.toFixed(2) + ' Mb'
    } else {
      return bytes+' Bytes'
    }
  }
  
}

export const bytesToMb = (bytes: number) => {
  return (bytes / 1048576).toFixed(2) + ' Mb';
};