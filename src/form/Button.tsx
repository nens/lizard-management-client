import React from "react";
// import buttonStyles from "../styles/Buttons.module.css";

interface MyProps {
  type: 'submit' | 'reset',
  readOnly?: boolean,
  onClick?: () => void,
};

export const Button: React.FC<MyProps> = (props) => {  
  const {
    type,
    readOnly,
    onClick
  } = props;

  return (
    <input
      type={type}
      value={type}
      // className={`${buttonStyles.Button} ${buttonStyles.Success}`}
      onClick={onClick}
      readOnly={!!readOnly}
    />
  );
}