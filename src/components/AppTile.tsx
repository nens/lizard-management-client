import React from "react";
import Ink from "react-ink";
import styles from "./AppTile.module.css";
import { RouteComponentProps, withRouter, NavLink } from 'react-router-dom';
import { FormattedMessage} from 'react-intl.macro';
import { useIntl} from 'react-intl';
import {formattedMessageToString} from './../utils/translationUtils';


interface Props {
  title: string, 
  icon: string, 
  linkPath: string,
  openInNewTab: boolean,
  readonly: boolean,
  requiredRoles: string[],
};

const AppTile = (props: (Props & RouteComponentProps)) => {
  
    const {
      title, icon, readonly, linkPath, openInNewTab,
      requiredRoles,
    } = props;

    const intl = useIntl();
    
    const requiredRolesLength = (requiredRoles && requiredRoles.length) || 0;
    
    // requiresRoleMessageForTranlation needs later to be renamed to requiresRoleMessage (when we make translations for the whole app)
    // eslint-disable-next-line
    const requiresRoleMessageForTranlation = formattedMessageToString(<FormattedMessage
        id="authorization.requires_role"
        defaultMessage="Requires {requiredRolesLength, plural,  one {role} other {one of the following roles} }"
        />,
        intl,
      {requiredRolesLength: requiredRolesLength}
    );

    const requiresRoleMessage = (requiredRolesLength === 1? "Requires role" : "Requires one of the following roles");

    const content = (
      <>
      <img src={icon} alt={title} className={styles.Img}/>
      <p className={styles.Title}>{title}</p>
      { !readonly ? <Ink recenter={true}/> : null }
      </>
    );
    if (readonly) {
      return (
        <div 
          className={`${styles.AppTile} ${readonly ? styles.Disabled: null}`}
          title={readonly ? requiresRoleMessage + requiredRoles : undefined}
        >
          {content}
        </div>
      );
    } else {
      return (
        <NavLink 
          to={linkPath}
          target={openInNewTab? "_blank" : "_self"}
          className={`${styles.AppTile} ${readonly ? styles.Disabled: null}`}
          title={readonly ? requiresRoleMessage + requiredRoles : undefined}
        >
          {content}
        </NavLink>
      );
    }
    
  }

export default withRouter(AppTile);
