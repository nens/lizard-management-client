export const toISOValue = (duration: durationObject): string | null => {
  let { days, hours, minutes, seconds } = duration;

  // Tiny hack: as we translate 'null' to all 0s, we do it the other
  // way around too.
  if (!days && !hours && !minutes && !seconds) {
    return null;
  };

  return (
    'P' + days + 'DT' +
     (hours < 10 ? "0" : "") + hours + 'H' +
     (minutes < 10 ? "0" : "") + minutes + 'M' +
     (seconds < 10 ? "0" : "") + seconds + 'S'
  );
}; 

export const rasterIntervalStringServerToDurationObject = (str: string): durationObject => {
  if (str.split(" ")[1] ) { // "2 03:04:05"
    return {
      days: Math.abs(parseInt(str.split(" ")[0])),
      hours: parseInt(str.split(" ")[1].split(":")[0]) ,
      minutes: parseInt(str.split(" ")[1].split(":")[1]) ,
      seconds: parseInt(str.split(" ")[1].split(":")[2]),
    };  
  } else { // "03:04:05"
    return {
      days: 0,
      hours: parseInt(str.split(":")[0]) ,
      minutes: parseInt(str.split(":")[1]) ,
      seconds: parseInt(str.split(":")[2]),
    };  
  }; 
};

export interface durationObject {
  days: number,
  hours: number,
  minutes: number,
  seconds: number
};