import React, { Component } from "react";
import styles from "./ClearInputButton.css";

class ClearInputButton extends Component {
  render() {
    return (
      <div className={this.props.className} onClick={this.props.onClick}>
        <i
          className={`${styles.ClearInput} ${styles.ClearInputTopRight} material-icons`}
        >
          clear
        </i>
      </div>
    );
  }
}

export default ClearInputButton;
