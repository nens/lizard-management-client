import React from "react";
import {useState, useEffect} from 'react';
import {useSelector,} from 'react-redux';
import {getSelectedOrganisation, getOrganisations} from '../reducers'
import CSSTransition from "react-transition-group/CSSTransition";
import formStyles from "../styles/Forms.module.css";
import MDSpinner from "react-md-spinner";

import styles from "./OrganisationSwitcher.module.css";
import { connect } from "react-redux";
import { selectOrganisation } from "../actions";
import { FormattedMessage, injectIntl } from "react-intl";
import { Scrollbars } from "react-custom-scrollbars";
import { userHasCorrectRolesForCurrentNavigationLinkTile} from '../home/AppTileConfig';


interface PropsArgs {
  handleClose: () => void,
}

type Props = PropsArgs & DispatchProps

// todo: add type defenitions props.intl.formatMessage
const OrganisationSwitcher = (props:Props) => {
  
  const [height, setHeight] = useState(window.innerHeight);
  const [filterValue, setFilterValue] = useState<null | string>(null);

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
    document.addEventListener("keydown", hideOrganisationSwitcher, false);
    const organisationNameElement = document.getElementById("organisationName");
    organisationNameElement && organisationNameElement.focus();
    return () => {
      window.removeEventListener("resize", handleResize, false);
      document.removeEventListener(
        "keydown",
        hideOrganisationSwitcher,
        false
      );
    };
  });

  // Todo howto remove this any
  const hideOrganisationSwitcher:any = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      props.handleClose();
    }
  }
  const handleResize = () => {
    setHeight(window.innerHeight);
  }
  
  // todo fix this any
  const handleInput = (e: any) => {
    setFilterValue( e.target.value);
  }
  
  // todo fix this any
  const selectOrganisation = (organisation:any) => {
    props.selectOrganisation(organisation, true);
  }
    const {
      handleClose,      
    } = props;

    const selectedOrganisation = useSelector(getSelectedOrganisation);
    const reduxOrganisations = useSelector(getOrganisations);
    const isFetching = reduxOrganisations.isFetching;
    const organisations = reduxOrganisations.available;

    const filteredOrganisations = filterValue
    // todo: fix this any
      ? organisations.filter((org:any) => {
        if (org.name.toLowerCase().indexOf(filterValue) !== -1) {
            return org;
          }
          return false;
        })
      : organisations;

    // todo add type defenitions for props.intl.formatMessage
    // @ts-ignore
    const authorisationText = props.intl.formatMessage({ id: "authorization.organisation_not_allowed_current_page", defaultMessage: "! Organisation not authorized to visit current page !" });

        

    return (
      <div className={styles.OrganisationSwitcherContainer}>
        <CSSTransition
          in={true}
          appear={true}
          timeout={500}
          classNames={{
            enter: styles.Enter,
            enterActive: styles.EnterActive,
            // Todo find out how to solve this
            // @ts-ignore
            leave: styles.Leave,
            leaveActive: styles.LeaveActive,
            appear: styles.Appear,
            appearActive: styles.AppearActive
          }}
        >
          <div className={styles.OrganisationSwitcher}>
            <div className={styles.CloseButton} onClick={handleClose}>
              <i className="material-icons">close</i>
            </div>
            <h3>
              <FormattedMessage
                id="components.switch_org"
                defaultMessage="Switch organisation"
              />
            </h3>
            <br />
            <div className={formStyles.FormGroup}>
              <input
                id="organisationName"
                tabIndex={-1}
                type="text"
                className={formStyles.FormControl}
                placeholder="Type here to filter the list of organisations..."
                onChange={handleInput}
              />
            </div>
            {isFetching ? (
              <div
                style={{
                  position: "relative",
                  top: 50,
                  height: 300,
                  bottom: 50,
                  marginLeft: "50%"
                }}
              >
                <MDSpinner size={24} />
              </div>
            ) : (
              <Scrollbars
                style={{ width: "100%", height: height - 400 }}
              >
                {filteredOrganisations
                // Todo fix any og organisation
                  ? filteredOrganisations.map((organisation:any, i:number) => {
                      const hasRequiredRoles = userHasCorrectRolesForCurrentNavigationLinkTile(organisation.roles);
                      return (
                        <div
                          key={organisation.uuid}
                          className={`${styles.OrganisationRow} ${selectedOrganisation &&
                          organisation.uuid === selectedOrganisation.uuid
                            ? styles.Active
                            : styles.InActive}`}
                          onClick={() => {
                            selectOrganisation(organisation);
                            handleClose();
                          }}
                        >
                          <i className="material-icons">group</i>
                          <div className={styles.OrganisationName}>
                            {organisation.name}
                          </div>
                          <div className={styles.OrganisationAuthorised}>
                          {!hasRequiredRoles? authorisationText  : null}
                          </div>
                        </div>
                      );
                    })
                  : null}
              </Scrollbars>
            )}
          </div>
        </CSSTransition>
      </div>
    );
  }

const mapDispatchToProps = (dispatch:any) => {
  return {
    selectOrganisation: (organisation:any, addNotification: boolean) => dispatch(selectOrganisation(organisation, addNotification))
  };
};

type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(
  injectIntl(OrganisationSwitcher)
);
