import React from "react";
import {useState, useEffect} from 'react';
import {useSelector,} from 'react-redux';
import {getSelectedOrganisation, getOrganisations} from '../reducers'
import CSSTransition from "react-transition-group/CSSTransition";
import formStyles from "../styles/Forms.module.css";
import MDSpinner from "react-md-spinner";

import styles from "./OrganisationSwitcher.module.css";
import { connect } from "react-redux";
import { fetchSupplierIds, selectOrganisation } from "../actions";
import { FormattedMessage, injectIntl } from "react-intl";
import { Scrollbars } from "react-custom-scrollbars";
import doArraysHaveEqualElement from '../utils/doArraysHaveEqualElement';
import {appTiles} from '../home/AppTileConfig';


const OrganisationSwitcher = (props:any) => {
  

  const [width, setWidth] = useState(window.innerWidth);
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

  const hideOrganisationSwitcher = (e: any) => {
    if (e.key === "Escape") {
      // @ts-ignore
      props.handleClose();
    }
  }
  const handleResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }
  
  const handleInput = (e: any) => {
    setFilterValue( e.target.value);
  }
  
  const selectOrganisation = (organisation:any) => {
    // @ts-ignore
    props.selectOrganisation(organisation, true);
  }
    const {
      // @ts-ignore
      handleClose,      
    } = props;

    const selectedOrganisation = useSelector(getSelectedOrganisation);
    const reduxOrganisations = useSelector(getOrganisations);
    const isFetching = reduxOrganisations.isFetching;
    const organisations = reduxOrganisations.available;

    // @ts-ignore
    const filteredOrganisations = filterValue
      ? organisations.filter((org:any) => {
        // @ts-ignore  
        if (org.name.toLowerCase().indexOf(filterValue) !== -1) {
            return org;
          }
          return false;
        })
      : organisations;

    const currentHomeAppTile = appTiles.find(icon => {
      return window.location.href.includes(icon.linksTo)
    });
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
                // @ts-ignore
                tabIndex="-1"
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
                // @ts-ignore
                style={{ width: "100%", height: height - 400 }}
              >
                {filteredOrganisations
                  // @ts-ignore
                  ? filteredOrganisations.map((organisation, i) => {
                      const hasRequiredRoles = !currentHomeAppTile || doArraysHaveEqualElement(organisation.roles, currentHomeAppTile.requiresOneOfRoles);
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

// @ts-ignore
const mapStateToProps = () => {
  return {
    
  };
};

// @ts-ignore
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // @ts-ignore
    selectOrganisation: (organisation, addNotification) => {
      dispatch(selectOrganisation(organisation, addNotification));
      dispatch(fetchSupplierIds());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  // @ts-ignore
  injectIntl(OrganisationSwitcher)
);
