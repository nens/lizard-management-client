import { fromISOValue } from "../forms/RelativeField";
import { toISOValue, durationObject } from "./isoUtils";

// Convert negative duration string to right positive value
// for example "P-1DT14H00M00S" should be converted to "P0DT10H00M00S"
// the negative sign would change the value of relative select box
// from "After" to "Before"

export const convertNegativeDuration = (duration: string) => {
    // If the duration includes negative sign then remove the - sign
    // and recalculate number of days, hours, minutes and seconds
    if (duration && duration.includes("-")) {
      const durationObject: durationObject = fromISOValue(duration.replace("-", ""));
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
    };
};

export const convertDurationObjToSeconds = (durationObject: durationObject): number => {
    const { days, hours, minutes, seconds } = durationObject;
    //1 day = 86400 seconds; 1 hour = 60 * 60 = 3600 seconds
    const totalNumberOfSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    return totalNumberOfSeconds;
};