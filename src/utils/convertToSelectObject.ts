export const convertToSelectObject = (value: string | number, label?: string, subLabel?: string) => {
  if (subLabel) {
    return {
      value: value,
      label: label || value+'',
      subLabel: subLabel
    };
  } else {
    return {
      value: value,
      label: label || value+''
    };
  };
};