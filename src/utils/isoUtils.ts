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

export const fromISOValue = (value: string | null): durationObject => {
  // Translate a string of the form 'P1DT10H20M50S' to an object.
  const isoRegex = /^P(\d*)DT(\d*)H(\d*)M(\d*)S$/;

  if (value) {
    const match = value.match(isoRegex);

    if (match) {
      return {
        days: parseFloat(match[1]) || 0,
        hours: parseFloat(match[2]) || 0,
        minutes: parseFloat(match[3]) || 0,
        seconds: parseFloat(match[4]) || 0,
      };
    };
  };

  return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };
};

export const rasterIntervalStringServerToDurationObject = (str: string): durationObject => {
  if (str.split(" ")[1] ) { // "2 03:04:05"
    return {
      days: parseInt(str.split(" ")[0]),
      hours: parseInt(str.split(" ")[1].split(":")[0]),
      minutes: parseInt(str.split(" ")[1].split(":")[1]),
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