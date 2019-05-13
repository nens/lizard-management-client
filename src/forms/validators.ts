// Functions to use as validators

// Sometimes they take arguments and return validators

export const nonEmptyString = (str: string): boolean =>
  str ? str.length > 1 : false;

export const testRegex = (regex: RegExp): Function =>
  (str: string): boolean => (str ? regex.test(str) : false);
