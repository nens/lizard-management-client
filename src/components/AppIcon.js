import React, { Component } from "react";
import Ink from "react-ink";
import styles from "./AppIcon.css";
import { withRouter } from "react-router-dom";
import { injectIntl } from "react-intl";


class AppIcon extends Component {
  render() {
    const { src, title, subTitle, handleClick, readonly, requiredRoles } = this.props;
    const requiresRoleMessage = this.props.intl.formatMessage({ id: "authorization.requires_role", defaultMessage: "Requires role: " });
    const requiresRolesMessage = this.props.intl.formatMessage({ id: "authorization.requires_roles", defaultMessage: "Requires one of the following roles: " });
    return (
      <div 
        className={`${styles.AppIcon} ${readonly ? styles.Disabled: null}`} 
        onClick={!readonly && handleClick} 
        title={
          readonly && requiredRoles.length === 1  
          ? 
          requiresRoleMessage + requiredRoles 
          : 
          readonly && requiredRoles.length > 1 
          ?
          requiresRolesMessage + requiredRoles 
          : 
          null 
        }
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
