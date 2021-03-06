import React, { Component } from "react";
import styles from "./ClearButton.module.css";

class ClearButton extends Component {
  render() {
    return (
      <div
        className={this.props.className}
        onClick={this.props.onClick}
        onMouseDown={e => e.preventDefault()} // to prevent focus on this element
        style={Object.assign(
          {},
          {
            display: "flex",
            alignItems: "center"
          },
          this.props.styles
        )}
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
