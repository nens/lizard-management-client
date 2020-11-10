import React from "react";
import styles from "./ClearInputButton.module.css";

interface ClearInputButtonProps {
  className?: string,
  icon?: string
  onClick: (e: any) => void
};

export const ClearInputButton: React.FC<ClearInputButtonProps> = (props) => {
  return (
    <div className={props.className} onClick={props.onClick}>
      <i
        className={`${styles.ClearInput} ${
          styles.ClearInputTopRight
        } material-icons`}
      >
        {props.icon || "clear"}
      </i>
    </div>
  );
}