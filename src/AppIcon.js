import React, { Component } from "react";
import Ink from "react-ink";
import styles from "./AppIcon.css";
import { withRouter } from "react-router-dom";


class AppIcon extends Component {
  render() {
    const { src, title, subTitle, handleClick } = this.props;
    return (
      <div className={styles.AppIcon} onClick={handleClick}>
        <img src={src} alt={title} className={styles.Img} />
        <p className={styles.Title}>{title}</p>
        <p className={styles.SubTitle}>{subTitle}</p>
        <Ink />
      </div>
    );
  }
}

export default withRouter(AppIcon);
