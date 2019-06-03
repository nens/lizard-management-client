// Functions to use as validators

// Sometimes they take arguments and return validators

// A Validator returns either an error message or false (if no errors)
type validatorResult = string | false;

export const nonEmptyString = (str: string): validatorResult => {
  if (typeof str !== 'string') {
    return "Please enter a string.";
  }

  if (str.length == 0) {
    return "Please enter a value.";
  }
  return false;
}

export const minLength = (length: number) => (s: string): validatorResult => {
  if (!s || s.length < length) {
    return `Please enter at least ${length} characters.`;
  }
  return false;
};

export const testRegex = (regex: RegExp, error: string) => (str: string): validatorResult => {
  if (!str || !regex.test(str)) {
    return error;
  }
  return false;
}
