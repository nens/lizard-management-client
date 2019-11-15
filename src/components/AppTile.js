import React, { Component } from "react";
import Ink from "react-ink";
import styles from "./AppTile.css";
import { withRouter } from "react-router-dom";


class AppTile extends Component {
  render() {
    const { title, bgImage, handleClick } = this.props;
    return (
      <div className={styles.AppTile} style={{backgroundImage: `url(${bgImage})`}} onClick={handleClick}>
        <p className={styles.Title}>{title}</p>
        <Ink />
      </div>
    );
  }
}

export default withRouter(AppTile);
