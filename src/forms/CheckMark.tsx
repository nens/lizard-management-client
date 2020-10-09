import React, { Component } from "react";
import formStyles from "../styles/Forms.module.css";

export default class CheckMark extends Component<{}, {}> {
  render() {
    return (
      <span className={formStyles.Checkmark}>
        {/* &#10004; */}
        {"✔"}
      </span>
    );
  }
}
