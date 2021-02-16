// Functions to use as validators

// A Validator returns either an error message or false (if no errors)
export type validatorResult = string | false;

export const required = (errorMessage: string, value: any): validatorResult => {
  if (value === null || value === '') {
    return errorMessage;
  }
  return false;
}

export const nonEmptyString = (str: string): validatorResult => {
  if (typeof str !== 'string') {
    return "Please enter a string.";
  }

  if (str.length === 0) {
    return "Please enter a value.";
  }
  return false;
}

export const minLength = (length: number, s: string): validatorResult => {
  if (!s || s.length < length) {
    return `Please enter at least ${length} characters.`;
  }
  return false;
};

export const maxLength = (length: number, s: string): validatorResult => {
  if (!s || s.length > length) {
    return `Please enter no more than ${length} characters.`;
  }
  return false;
};

export const testRegex = (regex: RegExp, error: string, str: string): validatorResult => {
  if (!str || !regex.test(str)) {
    return error;
  }
  return false;
};

export const rangeCheck = (value: number, min: number, max: number): validatorResult => {
  if ((!value && value !== 0) || value < min || value > max) {
    return `Choose between ${min} and ${max}`;
  }
  return false;
};

export const greaterThanMin = (minValue: number, maxValue: number): validatorResult => {
  if (minValue > maxValue) {
    return `Choose 'Max zoom level' greater than 'Min zoom level'`;
  }
  return false;
};

export const jsonValidator =  (jsonStr: string) => {
  try{
    JSON.parse(jsonStr as string)
  } catch(e) {
    return "needs to be valid JSON";
  }
  return false;
}