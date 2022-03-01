import { durationObject as DurationObject } from "./isoUtils";

export const convertDurationObjToSeconds = (durationObject: DurationObject): number => {
  const { days, hours, minutes, seconds } = durationObject;
  // 1 day = 86400 seconds; 1 hour = 60 * 60 = 3600 seconds
  const totalNumberOfSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
  return totalNumberOfSeconds;
};

export const convertSecondsToDurationObject = (totalSeconds: number) => {
  // Convert the total number of seconds to days, hours, minutes and seconds
  const absoluteTotalSeconds = Math.abs(totalSeconds);
  const days = Math.floor(absoluteTotalSeconds / 86400);
  const hours = Math.floor((absoluteTotalSeconds % 86400) / 3600);
  const minutes = Math.floor(((absoluteTotalSeconds % 86400) % 3600) / 60);
  const seconds = ((absoluteTotalSeconds % 86400) % 3600) % 60;

  const durationObject = {
    days,
    hours,
    minutes,
    seconds,
  };

  return durationObject;
};

export const getLocalDateString = (value: string) => {
  const dateObject = new Date(value);
  return dateObject.toLocaleDateString();
};
