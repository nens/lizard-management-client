import React, { Component } from "react";

import styles from "./GenericCheckBox.css";
// import formStyles from "../styles/Forms.css";
// import displayStyles from "../styles/Display.css";

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

  setHoverAfterUncheck(hoverAfterUncheck) {
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
      label // text to set the label
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
        className={styles.Container}
        onMouseUp={e => {
          this.setHoverAfterUncheck(true);
          updateModelValue(!modelValue);
        }}
        onMouseEnter={e => this.setHoverAfterUncheck(true)}
        onMouseLeave={e => this.setHoverAfterUncheck(false)}
      >
        <span
          className={`${styles.CheckboxSpan} ${checkedClass} ${hoverClass}`}
        >
          {/* always render checkmark but make color transparent with css */}
          {"✔"}
        </span>
        <label className={styles.Label}>{label}</label>
      </div>
    );
  }
}

export default GenericCheckBox;
