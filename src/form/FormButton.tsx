import React, { useEffect, useRef } from "react";
import formStyles from "../styles/Forms.module.css";
import buttonStyles from "../styles/Buttons.module.css";

interface MyProps {
  name: string,
  title: string,
  text: string,
  validated: boolean,
  errorMessage?: string | false,
  onFocus?: (e: React.FocusEvent<HTMLButtonElement>) => void,
  onBlur?: () => void,
  readOnly?: boolean,
  readOnlyTooltip?: string,
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  form?: string,
};

export const FormButton: React.FC<MyProps> = (props) => {  
  const {
    name,
    title,
    text,
    validated,
    errorMessage,
    onFocus,
    onBlur,
    readOnly,
    readOnlyTooltip,
    onClick,
    form,
  } = props;

  // Set validity of the input field
  const myButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (myButton && myButton.current) {
      if (validated) {
        myButton.current.setCustomValidity('');
      } else {
        myButton.current.setCustomValidity(errorMessage || '');
      };
    };
  })

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
          ref={myButton}
          name={name}
          id={name}
          className={`${buttonStyles.NewButton} ${readOnly ? buttonStyles.Inactive : ''}`}
          onClick={!readOnly ? onClick : undefined}
          title={(readOnly && readOnlyTooltip) || undefined}
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