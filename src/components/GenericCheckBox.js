import React, { Component } from "react";

import styles from "./GenericCheckBox.css";
import inputStyles from "../styles/Input.css";

class GenericCheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // boolean to hold if mouse is hoovering over the element after unchecking it.
      // In this case checkmark '✔' should not appear on hoover
      // this to prevent user from seeing confusing checkmark after unchecking it
      hoverAfterUncheck: false,
      hover: false
    };
  }

  setHoverState(hoverAfterUncheck) {
    this.setState({ hover: hoverAfterUncheck });

    if (hoverAfterUncheck === true) {
      if (this.props.modelValue === true) {
        this.setState({ hoverAfterUncheck });
      }
    } else {
      this.setState({ hoverAfterUncheck });
    }
  }

  render() {
    const {
      modelValue, // boolean
      updateModelValue, // function to update modelvalue on parent
      label, // text to set the label
      readonly
    } = this.props;
    const { hoverAfterUncheck, hover } = this.state;

    const checkedClass =
      modelValue === true ? styles.Checked : styles.Unchecked;
    // only set hover css class if element is unchecked and mouse is not hovering after unchecking the checkbox
    const hoverClass =
      modelValue === false && hoverAfterUncheck === false && hover === true
        ? styles.Hover
        : null;

    return (
      <div
        className={
          styles.Container +
          " " +
          (readonly ? styles.CursorNotAllowed : styles.CursorPointer)
        }
        onMouseUp={e => {
          !readonly && this.setHoverState(true);
          !readonly && updateModelValue(!modelValue);
        }}
        onMouseEnter={e => !readonly && this.setHoverState(true)}
        onMouseLeave={e => !readonly && this.setHoverState(false)}
      >
        {/* this input element has currently no use but should be kept in sync with the custom checkbox */}
        {/* this way it will be possible to use the standard browser funvtionality as onfocus and screenreaders etc */}
        <input
          type="checkbox"
          style={{ opacity: 0, position: "absolute" }}
          checked={modelValue}
          onChange={() => {}} // no op in order to suppress error in console
        />
        <span
          className={`${styles.CheckboxSpan} ${checkedClass} ${hoverClass} ${readonly
            ? inputStyles.ReadOnly
            : ""}`}
        >
          {/* always render checkmark but make hidden or transparent with css */}
          <span>{"✔"}</span>
        </span>
        <label
          className={
            styles.Label + " " + (readonly ? "" : styles.CursorPointer)
          }
        >
          {label}
        </label>
      </div>
    );
  }
}

export default GenericCheckBox;
