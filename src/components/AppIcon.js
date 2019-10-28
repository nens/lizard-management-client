import React, { Component } from "react";
import Ink from "react-ink";
import styles from "./AppIcon.css";
import { withRouter } from "react-router-dom";


class AppIcon extends Component {
  render() {
    const { src, title, subTitle, handleClick, readonly } = this.props;
    return (
      <div className={`${styles.AppIcon} ${readonly ? styles.Disabled: null}`} onClick={!readonly && handleClick} title={readonly ? "This feature is readonly since you do not have one of the following roles for the selected organisation: "  : null }>
        <img src={src} alt={title} className={styles.Img} />
        <p className={styles.Title}>{title}</p>
        <p className={styles.SubTitle}>{subTitle}</p>
        { !readonly ? <Ink/> : null }
      </div>
    );
  }
}

export default withRouter(AppIcon);
