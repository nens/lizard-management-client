import React from "react";
import formStyles from "../styles/Forms.module.css";
import Checkbox from "../components/Checkbox";

interface CheckBoxProps {
  title: string | JSX.Element,
  name: string,
  value: boolean,
  valueChanged: (bool: boolean) => void,
  onFocus?: (e: any) => void,
  onBlur?: () => void,
  readOnly?: boolean
};

export const CheckBox: React.FC<CheckBoxProps> = (props) => {
  const {
    title,
    name,
    value,
    valueChanged,
    onFocus,
    onBlur,
    readOnly
  } = props;

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
      <Checkbox
        name={name}
        checked={value}
        onChange={() => valueChanged(!value)}
        size={36}
        borderRadius={3}
        checkmarkColor={'#009f86'}
        readOnly={readOnly}
      />
    </label>
  );
}