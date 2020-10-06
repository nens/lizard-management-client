import React, { Component } from "react";
import formStyles from "../styles/Forms.css";

class CheckMark extends Component {
  render() {
    return (
      <span className={formStyles.Checkmark}>
        {/* &#10004; */}
        {"✔"}
      </span>
    );
  }
}

export default CheckMark;
