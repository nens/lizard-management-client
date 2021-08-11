import React from "react";
import Ink from "react-ink";
import styles from "./AppTileHomeType.module.css";
import { RouteComponentProps, withRouter, NavLink } from 'react-router-dom';
import { injectIntl } from "react-intl";

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
      requiredRoles // eslint-disable-line no-unused-vars
    } = props;
    
    // ts ignore because how to use intl with typescript in props? Maybe look at how it is done in 3di-livesite  or here https://stackoverflow.com/questions/40784817/react-intl-use-api-with-typescript
    // @ts-ignore
    const requiresRoleMessage = props.intl.formatMessage({
        id: "authorization.requires_role",
        defaultMessage: "Requires {requiredRolesLength, plural,  one {role} other {one of the following roles} }: ",
      },
      {requiredRolesLength: (requiredRoles && requiredRoles.length) || 0}
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
      return (
        <a 
            href={linkPath}
            target={openInNewTab? "_blank" : "_self"}
            className={`${styles.AppTile} ${readonly ? styles.Disabled: null}`}
            title={readonly ? requiresRoleMessage + requiredRoles : null}
        >
          {tileContent}
        </a>
      );
    } else {
      return (
        <NavLink 
            to={linkPath}
            target={openInNewTab? "_blank" : "_self"}
            className={`${styles.AppTile} ${readonly ? styles.Disabled: null}`}
            title={readonly ? requiresRoleMessage + requiredRoles : null}
        >
          {tileContent}
        </NavLink>
      );    
      }
  }

export default withRouter(injectIntl(AppTileHomeType));
