import React, { Component } from "react";
import styles from "./ClearButton.css";

class ClearButton extends Component {
  render() {
    return (
      <div
        className={this.props.className}
        onClick={this.props.onClick}
        style={{
          display: "flex",
          alignItems: "center"
        }}
      >
        <i
          className={`${styles.ClearInput} 
             material-icons`}
        >
          clear
        </i>
      </div>
    );
  }
}

export default ClearButton;
