import React, { Component } from "react";
import styles from "./ClearInputButton.css";

interface ClearInputButtonProps {
  className: string,
  onClick: (e: any) => void
};

export default class ClearInputButton extends Component<ClearInputButtonProps, {}> {
  render() {
    return (
      <div className={this.props.className} onClick={this.props.onClick}>
        <i
          className={`${styles.ClearInput} ${
            styles.ClearInputTopRight
          } material-icons`}
        >
          clear
        </i>
      </div>
    );
  }
}
