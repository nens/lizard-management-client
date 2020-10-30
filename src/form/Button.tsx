import React from "react";
// import buttonStyles from "../styles/Buttons.module.css";

interface MyProps {
  type: 'submit' | 'reset',
  readOnly?: boolean
};

export const Button: React.FC<MyProps> = (props) => {  
  const {
    type,
    readOnly
  } = props;

  return (
    <input
      type={type}
      value={type}
      // className={`${buttonStyles.Button} ${buttonStyles.Success}`}
      readOnly={!!readOnly}
    />
  );
}