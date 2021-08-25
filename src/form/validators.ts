// Functions to use as validators
import { Location } from "../types/locationFormTypes";

// A Validator returns either an error message or false (if no errors)
export type validatorResult = string | false;

export const required = (errorMessage: string, value: any): validatorResult => {
  if (value === undefined || value === null || value === '') {
    return errorMessage;
  }
  return false;
}

export const nonEmptyString = (str: string): validatorResult => {
  if (typeof str !== 'string') {
    return "Please enter a string";
  }

  if (str.length === 0) {
    return "Please enter a value";
  }
  return false;
}

export const isNotLiteralStringNew = (str: string): validatorResult => {
  const strippedString = str.replace(/\s/g, '');
  if ( strippedString === 'new' || strippedString === 'New') {
    return "The value 'new' is not allowed here";
  }
  return false;
}

export const minLength = (length: number, s: string): validatorResult => {
  if (!s || s.length < length) {
    return `Please enter at least ${length} ${length === 1 ? 'character' : 'characters'}`;
  }
  return false;
};

export const maxLength = (length: number, s: string): validatorResult => {
  if (!s || s.length > length) {
    return `Please enter no more than ${length} ${length === 1 ? 'character' : 'characters'}`;
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

export const jsonValidator = (jsonStr: string) => {
  try{
    JSON.parse(jsonStr as string)
  } catch(e) {
    return "Please fill in valid JSON format";
  }
  return false;
};

export const emailValidator = (address: string) => {
  if (/^\w+([+.-]\w+)*@\w+([.-]\w+)*(\.\w{2,3})+$/.test(address)) {
    return false;
  };
  return 'Please enter a valid email address';
};

export const phoneNumberValidator = (phoneNumber: string) => {
  if (/^[+]?[0-9]{9,15}$/.test(phoneNumber)) {
    return false;
  };
  return 'Please enter a valid phone number';
};

export const relativeEndValidator = (relativeStart: number | null, relativeEnd: number | null) => {
  if (
    (relativeStart !== null) &&
    (relativeEnd !== null) &&
    relativeStart > relativeEnd
  ) {
    return 'Please select "Relative End" after "Relative Start"';
  } else {
    return false;
  };
};

export const geometryValidator = (location: Location | null) => {
  if (
    location &&
    !isNaN(location.lat) &&
    !isNaN(location.lng)
  ) {
    return true;
  } else {
    return false;
  };
};