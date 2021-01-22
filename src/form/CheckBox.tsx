import React from "react";
import formStyles from "../styles/Forms.module.css";
import Checkbox from "../components/Checkbox";

interface CheckBoxProps {
  title: string | JSX.Element,
  name: string,
  value: boolean,
  valueChanged: (bool: boolean) => void,
  form?: string,
  onFocus?: (e: any) => void,
  onBlur?: () => void,
  readOnly?: boolean
  validated?: boolean;
  errorMessage?: string | false; 
};

export const CheckBox: React.FC<CheckBoxProps> = (props) => {
  const {
    title,
    name,
    value,
    valueChanged,
    form,
    onFocus,
    onBlur,
    readOnly,
    validated,
    errorMessage,
  } = props;

  return (
    <label
      htmlFor={name+'_checkbox'}
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
        onFocus={onFocus}
        onBlur={onBlur}
        readOnly={readOnly}
        form={form}
        validated={validated}
        errorMessage={errorMessage}
      />
    </label>
  );
}