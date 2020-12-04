import React from "react";
import buttonStyles from "../styles/Buttons.module.css";

interface MyProps {
  readOnly?: boolean,
  onClick?: () => void,
};

export const SubmitButton: React.FC<MyProps> = (props) => {  
  const {
    readOnly,
    onClick
  } = props;

  return (
    <input
      type={'submit'}
      value={'Save'}
      className={buttonStyles.NewButton}
      onClick={onClick}
      readOnly={!!readOnly}
    />
  );
}