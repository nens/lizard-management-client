import React, { Component } from "react";
import Ink from "react-ink";
import styles from "./AppIcon.css";
import { withRouter } from "react-router-dom";


class AppIcon extends Component {
  render() {
    const { bgImage, handleClick } = this.props;
    return (
      <div className={styles.AppIcon} style={{backgroundImage: `url(${bgImage})`}} onClick={handleClick}>
        <Ink />
      </div>
    );
  }
}

export default withRouter(AppIcon);
