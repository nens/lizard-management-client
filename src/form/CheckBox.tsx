import React from "react";
import formStyles from "../styles/Forms.module.css";
import Checkbox from "../components/Checkbox";

interface CheckBoxProps {
  title: string | JSX.Element;
  name: string;
  value: boolean;
  valueChanged: (bool: boolean) => void;
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  readOnly?: boolean;
  validated?: boolean;
  errorMessage?: string | false;
  htmlTitle?: string;
}

export const CheckBox: React.FC<CheckBoxProps> = (props) => {
  const {
    title,
    name,
    value,
    valueChanged,
    onFocus,
    onBlur,
    readOnly,
    validated,
    errorMessage,
    htmlTitle,
  } = props;

  return (
    <label htmlFor={name + "_checkbox"} className={formStyles.Label}>
      <span className={formStyles.LabelTitle}>{title}</span>
      <Checkbox
        name={name}
        checked={value}
        onChange={() => valueChanged(!value)}
        size={36}
        borderRadius={3}
        checkmarkColor={"#009f86"}
        onFocus={onFocus}
        onBlur={onBlur}
        readOnly={readOnly}
        validated={validated}
        errorMessage={errorMessage}
        title={htmlTitle}
      />
    </label>
  );
};
