import React from "react";
import Ink from "react-ink";
import styles from "./AppTileHomeType.module.css";
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { injectIntl } from "react-intl";

interface Props {
  title: string, 
  icon: string, 
  handleClick: ()=> void, 
  readonly: boolean,
  requiredRoles: string[]
};

const AppTileHomeType = (props: (Props & RouteComponentProps)) => {
  
    const {
      title, icon, handleClick, readonly,
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
    return (
      <div className={`${styles.AppTile} ${readonly ? styles.Disabled: null}`}
           onClick={!readonly ? handleClick : undefined}
           title={readonly ? requiresRoleMessage + requiredRoles : null}
      >
        <hr className={styles.DecorativeLine}/>
        <div
					className={styles.IconCircleContainer}
        >
					<img src={icon} alt={title}/>
        </div>
        
        <p className={styles.Title}>{title}</p>
        <p className={styles.Subtitle}>{"Some subtitle or a bit long bla bla"}</p>
        { !readonly ? <Ink recenter={true}/> : null }
      </div>
    );
  }

export default withRouter(injectIntl(AppTileHomeType));
