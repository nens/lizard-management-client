export const convertToSelectObject = (value: string | number, label?: string, subLabel?: string, subLabel2?: string) => {
  return {
    value,
    label: label || value+'',
    subLabel,
    subLabel2
  };
};