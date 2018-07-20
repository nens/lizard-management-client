import React, { Component } from "react";
import styles from "./ClearInputButton.css";

class ClearInputButton extends Component {
  render() {
    return (
      <div class={this.props.className} onClick={this.props.onClick}>
        <i className={`${styles.ClearInput} material-icons`}>clear</i>
      </div>
    );
  }
}

export default ClearInputButton;
