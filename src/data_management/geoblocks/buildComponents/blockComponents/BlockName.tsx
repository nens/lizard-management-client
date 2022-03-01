import React, { useState } from "react";
import styles from "./BlockName.module.css";
import buttonStyles from "../../../../styles/Buttons.module.css";

interface MyProps {
  label: string;
  onConfirm: (value: string) => void;
}

export const BlockName = (props: MyProps) => {
  const { label, onConfirm } = props;
  const [showInput, setShowInput] = useState<boolean>(false);
  const [name, setName] = useState<string>(label);

  return (
    <div className={styles.NameContainer}>
      {showInput ? (
        <input
          type="text"
          className={styles.NameInput + " nodrag"}
          placeholder={"Enter a name"}
          title={name}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      ) : (
        <b className={styles.BlockName} title={label}>
          {label}
        </b>
      )}
      <button
        className={`${buttonStyles.IconButton} ${buttonStyles.IconButtonWithoutOutline}`}
        title={showInput ? "Confirm block name" : "Edit block name"}
        onClick={() => {
          if (showInput && name !== label) onConfirm(name);
          setShowInput(!showInput);
        }}
        disabled={!name}
      >
        <i
          className={showInput ? "fa fa-check" : "fa fa-pen"}
          style={{ color: "var(--color-header)" }}
        />
      </button>
    </div>
  );
};
