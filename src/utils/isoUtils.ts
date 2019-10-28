import { fromISOValue } from "../forms/RelativeField";

export const toISOValue = (duration: durationObject): string | null => {
  let { days, hours, minutes, seconds } = duration;

  // Tiny hack: as we translate 'null' to all 0s, we do it the other
  // way around too.
  if (!days && !hours && !minutes && !seconds) {
    return null;
  }

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
      days: parseInt(str.split(" ")[0]),
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
  }
  
  
}

export interface durationObject {
  days: number,
  hours: number,
  minutes: number,
  seconds: number
}

// Convert negative duration string to right positive value
// for example "P-1DT14H00M00S" should be converted to "P0DT10H00M00S"
// the negative sign would change the value of relative select box
// from "After" to "Before"

export const convertNegativeDuration = (duration: string) => {
  // If the duration includes negative sign then remove the - sign
  // and recalculate number of days, hours, minutes and seconds
  if (duration && duration.includes("-")) {
    const durationObject = fromISOValue(duration.replace("-", ""));
    const { days, hours, minutes, seconds } = durationObject;
    const totalNumberOfSeconds = days*86400 - (hours*3600 + minutes*60 + seconds);

    // Convert the total number of seconds to days, hours, minutes and seconds
    const numDays = Math.floor(totalNumberOfSeconds / 86400);
    const numHours = Math.floor((totalNumberOfSeconds % 86400) / 3600);
    const numMinutes = Math.floor(((totalNumberOfSeconds % 86400) % 3600) / 60);
    const numSeconds = ((totalNumberOfSeconds % 86400) % 3600) % 60;

    const newDurationObject = {
      days: numDays,
      hours: numHours,
      minutes: numMinutes,
      seconds: numSeconds
    };
    return toISOValue(newDurationObject);
  } else {
    // If the duration does not include negative sign
    // then keep the duration as it is
    return duration;
  }
}