import React, { useState } from "react";
import styles from "./CheckBox.module.css";
import formStyles from "../styles/Forms.module.css";

interface CheckBoxProps {
  title: string | JSX.Element,
  name: string,
  value: boolean,
  valueChanged: (bool: boolean) => void,
  readonly?: boolean
};

export const CheckBox: React.FC<CheckBoxProps> = (props) => {
  // boolean to hold if mouse is hoovering over the element after unchecking it.
  // In this case checkmark '✔' should not appear on hover
  // this to prevent user from seeing confusing checkmark after unchecking it
  const [hover, setHover] = useState<boolean>(false);
  const [hoverAfterUncheck, setHoverAfterUncheck] = useState<boolean>(false);

  const setHoverState = (hoverAfterUncheck: boolean) => {
    setHover(hoverAfterUncheck);

    if (hoverAfterUncheck) {
      if (props.value) {
        setHoverAfterUncheck(hoverAfterUncheck);
      };
    } else {
      setHoverAfterUncheck(hoverAfterUncheck);
    }
  }

  const {
    title,
    name,
    value,
    valueChanged,
    readonly
  } = props;

  const checkedClass = value ? styles.Checked : styles.Unchecked;
  // only set hover css class if element is unchecked and mouse is not hovering after unchecking the checkbox
  const hoverClass = (
    !value && !hoverAfterUncheck && hover ? styles.Hover : null
  );

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
      <div
        className={
          styles.Container +
          " " +
          (readonly ? styles.CursorNotAllowed : styles.CursorPointer)
        }
        onMouseUp={e => {
          !readonly && setHoverState(true);
          !readonly && valueChanged(!value);
        }}
        onMouseEnter={e => !readonly && setHoverState(true)}
        onMouseLeave={e => !readonly && setHoverState(false)}
      >
        {/* this input element has currently no use but should be kept in sync with the custom checkbox */}
        {/* this way it will be possible to use the standard browser functionality as onfocus and screenreaders etc */}
        <input
          type="checkbox"
          style={{ opacity: 0, position: "absolute" }}
          checked={value}
          onChange={() => {}} // no op in order to suppress error in console
        />
        <span
          className={`${styles.CheckboxSpan} ${checkedClass} ${hoverClass}`}
        >
          {/* always render checkmark but make hidden or transparent with css */}
          <span>{"✔"}</span>
        </span>
      </div>
    </label>
  );
}