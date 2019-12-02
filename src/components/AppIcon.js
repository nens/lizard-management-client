import React, { Component } from "react";
import Ink from "react-ink";
import styles from "./AppIcon.css";
import { withRouter } from "react-router-dom";
import { injectIntl } from "react-intl";


class AppIcon extends Component {
  render() {
    const { 
      src, title, subTitle, handleClick, readonly, 
      requiredRoles // eslint-disable-line no-unused-vars
    } = this.props;
    const requiresRoleMessage = this.props.intl.formatMessage({ 
        id: "authorization.requires_role", 
        defaultMessage: "Requires {requiredRolesLength, plural,  one {role} other {one of the following roles} }: ",
      },
      {requiredRolesLength: (requiredRoles && requiredRoles.length) || 0}
    );
    return (
      <div 
        className={`${styles.AppIcon} ${readonly ? styles.Disabled: null}`} 
        onClick={!readonly ? handleClick : undefined} 
        title={readonly ? requiresRoleMessage + requiredRoles : null}
      >
        <img src={src} alt={title} className={styles.Img}/>
        <p className={styles.Title}>{title}</p>
        <p className={styles.SubTitle}>{subTitle}</p>
        { !readonly ? <Ink/> : null }
      </div>
    );
  }
}

export default withRouter(injectIntl(AppIcon));
