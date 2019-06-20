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

export interface durationObject {
  days: number,
  hours: number,
  minutes: number,
  seconds: number
}