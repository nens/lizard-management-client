import React, { Component } from "react";

import styles from "./CheckBox.css";
import inputStyles from "../styles/Input.css";

interface CheckBoxProps {
  label: string,
  name: string,
  value: boolean,
  validators?: Function[],
  validated: boolean,
  handleEnter: (e: any) => void,
  valueChanged: Function,
  wizardStyle: boolean
};

interface CheckBoxState {
  hover: boolean,
  hoverAfterUncheck: boolean
}

class CheckBox extends Component<CheckBoxProps, CheckBoxState> {
  constructor(props: CheckBoxProps) {
    super(props);
    this.state = {
      // boolean to hold if mouse is hoovering over the element after unchecking it.
      // In this case checkmark '✔' should not appear on hover
      // this to prevent user from seeing confusing checkmark after unchecking it
      hoverAfterUncheck: false,
      hover: false
    };
  }

  setHoverState(hoverAfterUncheck: boolean): void {
    this.setState({ hover: hoverAfterUncheck });

    if (hoverAfterUncheck) {
      if (this.props.value) {
        this.setState({ hoverAfterUncheck });
      }
    } else {
      this.setState({ hoverAfterUncheck });
    }
  }

  render() {
    const {
      value,
      valueChanged,
      label
    } = this.props;
    const {
      hoverAfterUncheck,
      hover
    } = this.state;

    const checkedClass = value ? styles.Checked : styles.Unchecked;
    // only set hover css class if element is unchecked and mouse is not hovering after unchecking the checkbox
    const hoverClass = (
      !value && !hoverAfterUncheck && hover ? styles.Hover : null
    );

    return (
      <div
        className={styles.Container}
        onMouseUp={e => {
          this.setHoverState(true);
          valueChanged(!value);
        }}
        onMouseEnter={e => this.setHoverState(true)}
        onMouseLeave={e => this.setHoverState(false)}
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
        <label className={`${styles.Label} ${styles.CursorPointer}`}>
          {label}
        </label>
      </div>
    );
  }
}

export default CheckBox;
