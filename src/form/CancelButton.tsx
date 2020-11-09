import React from "react";
import { NavLink } from "react-router-dom";
import buttonStyles from "../styles/Buttons.module.css";

interface MyProps {
  url: string
};

export const CancelButton: React.FC<MyProps> = (props) => {  
  const {
    url
  } = props;

  return (
    <NavLink
      to={url}
      className={buttonStyles.ButtonLink}
    >
      CANCEL
    </NavLink>
  );
};