import React from "react";
import styles from "./ActionList.module.css";

interface Props {
  actions: string[];
  onChange: (value: string) => void;
  showActionList: boolean;
  dropUp?: boolean;
}

const ActionList: React.FC<Props> = ({ actions, onChange, showActionList, dropUp }) => {
  return (
    <ul
      className={styles.ActionList}
      style={{
        display: showActionList ? "block" : "none",
        bottom: dropUp ? "100%" : undefined,
        top: dropUp ? "unset" : undefined,
      }}
    >
      {actions.map((action, i) => (
        <li
          key={i}
          value={action}
          onMouseDown={() => onChange(action)} // use onMouseDown instead of onClick to fire the action before the onBlur event in the parent component
        >
          {action}
        </li>
      ))}
    </ul>
  );
};

export default ActionList;
