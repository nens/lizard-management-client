// Functions to use as validators

// A Validator returns either an error message or false (if no errors)
export type validatorResult = string | false;

export const required = (errorMessage:string) => (value: any): validatorResult => {
  if (value === null) {
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
