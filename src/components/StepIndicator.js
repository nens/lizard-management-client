import React, { Component } from "react";
import styles from "./StepIndicator.css";

class StepIndicator extends Component {
  render() {
    const { indicator, active } = this.props;
    return (
      <div
        className={`${styles.StepIndicator} ${active
          ? styles.Active
          : styles.Inactive}`}
      >
        {indicator || ""}
      </div>
    );
  }
}

export default StepIndicator;
