import React from "react";
import formStyles from "../styles/Forms.module.css";
import buttonStyles from "../styles/Buttons.module.css";

interface MyProps {
  name: string,
  title: string,
  text: string,
  readOnly?: boolean,
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  form?: string,
};

export const FormButton: React.FC<MyProps> = (props) => {  
  const {
    name,
    title,
    text,
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
          className={buttonStyles.NewButton}
          onClick={onClick}
          disabled={!!readOnly}
          form={form}
        >
          {text}
        </button>
      </div>
    </label>
  );
}