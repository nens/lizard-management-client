import React, { Component } from "react";
import styles from "./StepIndicator.module.css";

interface StepIndicatorProps {
  indicator: number,
  active: boolean,
  handleClick?: (e: any) => void
};

export default class StepIndicator extends Component<StepIndicatorProps, {}> {
  render() {
    const { indicator, active, handleClick } = this.props;
    return (
      <div
        onClick={handleClick}
        className={`${styles.StepIndicator} ${active
          ? styles.Active
          : styles.Inactive}`}
      >
        {"" + indicator}
      </div>
    );
  }
}
