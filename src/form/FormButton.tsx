import React from "react";
import formStyles from "../styles/Forms.module.css";
import buttonStyles from "../styles/Buttons.module.css";

interface MyProps {
  name: string,
  title: string,
  text: string,
  onFocus?: (e: React.FocusEvent<HTMLButtonElement>) => void,
  onBlur?: () => void,
  readOnly?: boolean,
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  form?: string,
};

export const FormButton: React.FC<MyProps> = (props) => {  
  const {
    name,
    title,
    text,
    onFocus,
    onBlur,
    readOnly,
    onClick,
    form,
  } = props;

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
      <div>
        <button
          name={name}
          id={name}
          className={buttonStyles.NewButton}
          onClick={onClick}
          disabled={!!readOnly}
          form={form}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          {text}
        </button>
      </div>
    </label>
  );
}