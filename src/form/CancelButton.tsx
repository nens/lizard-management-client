import React from "react";
import { NavLink } from "react-router-dom";
import buttonStyles from "../styles/Buttons.module.css";

interface MyProps {
  url: string;
  buttonText?: string;
}

export const CancelButton: React.FC<MyProps> = (props) => {
  const {
    url,
    buttonText,
  } = props;

  return (
    <NavLink to={url} className={buttonStyles.ButtonLink}>
      {buttonText ? buttonText : "CANCEL"}
    </NavLink>
  );
};
