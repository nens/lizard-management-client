export const convertToSelectObject = (
  value: string | number,
  label?: string, // label to display in input and dropdown list
  subLabel?: string, // sub-label next to the label in the dropdown
  subLabel2?: string, // 2nd sub-lable next to the sub-label in the dropdown
  subInputInfo?: string // additional info added next to the input value
) => {
  return {
    value,
    label: label || value+'',
    subLabel,
    subLabel2,
    subInputInfo
  };
};