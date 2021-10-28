import React from "react";
import Ink from "react-ink";
import styles from "./AppTileHomeType.module.css";
import { RouteComponentProps, withRouter, NavLink } from 'react-router-dom';
import { FormattedMessage} from 'react-intl.macro';
import { useIntl} from 'react-intl';
import {formattedMessageToString} from './../utils/translationUtils';

interface Props {
  title: string,
  subtitle: string, 
  icon: string, 
  linkPath: string,
  openInNewTab: boolean,
  linksToUrlExternal: boolean,
  readonly: boolean,
  requiredRoles: string[]
};

const AppTileHomeType = (props: (Props & RouteComponentProps)) => {
  
    const {
      title, subtitle, icon, readonly, linkPath, openInNewTab, linksToUrlExternal,
      requiredRoles,
    } = props;

    const intl = useIntl();

    const requiredRolesLength = (requiredRoles && requiredRoles.length) || 0;
    const requiresRoleMessage = formattedMessageToString(<FormattedMessage
        id="authorization.requires_role"
        defaultMessage="Requires {requiredRolesLength, plural,  one {role} other {one of the following roles} }: "
      />,
      intl,
    {requiredRolesLength: requiredRolesLength}
  );

    const tileContent = (
      <>
        <hr className={styles.DecorativeLine}/>
        <div
					className={styles.IconCircleContainer}
        >
					<img src={icon} alt={title}/>
        </div>
        
        <p className={styles.Title}>{title}</p>
        <p className={styles.Subtitle}>{subtitle}</p>
        { !readonly ? <Ink recenter={true}/> : null }
      </>
    );
    if (readonly) {
      return (
        <div
          className={`${styles.AppTile} ${readonly ? styles.Disabled: null}`}
          title={ requiresRoleMessage + requiredRoles}
        >
          {tileContent}
        </div>
      );
    }
    else if (linksToUrlExternal) {
      if (openInNewTab) {
        return (
          <a 
              href={linkPath}
              target={"_blank"}
              rel={"noreferrer"}
              className={`${styles.AppTile} ${readonly ? styles.Disabled: null}`}
              title={readonly ? requiresRoleMessage + requiredRoles : undefined}
          >
            {tileContent}
          </a>
        );
      } else {
        return (
          <a 
              href={linkPath}
              target={"_self"}
              className={`${styles.AppTile} ${readonly ? styles.Disabled: null}`}
              title={readonly ? requiresRoleMessage + requiredRoles : undefined}
          >
            {tileContent}
          </a>
        );
      }
      
    } else {
      return (
        <NavLink 
            to={linkPath}
            target={openInNewTab? "_blank" : "_self"}
            className={`${styles.AppTile} ${readonly ? styles.Disabled: null}`}
            title={readonly ? requiresRoleMessage + requiredRoles : undefined}
        >
          {tileContent}
        </NavLink>
      );    
      }
  }

export default withRouter((AppTileHomeType));
