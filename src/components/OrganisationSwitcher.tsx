import {useSelector,} from 'react-redux';
import CSSTransition from "react-transition-group/CSSTransition";
import formStyles from "../styles/Forms.module.css";
import MDSpinner from "react-md-spinner";
import React, { Component } from "react";
import styles from "./OrganisationSwitcher.module.css";
import { connect } from "react-redux";
import { fetchSupplierIds, selectOrganisation } from "../actions";
import { FormattedMessage, injectIntl } from "react-intl";
import { Scrollbars } from "react-custom-scrollbars";
import doArraysHaveEqualElement from '../utils/doArraysHaveEqualElement';
import {appTiles} from '../home/AppTileConfig';


class OrganisationSwitcher extends Component {
  constructor(props:any) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      filterValue: null
    };
    this.handleResize = this.handleResize.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.selectOrganisation = this.selectOrganisation.bind(this);
    this.hideOrganisationSwitcher = this.hideOrganisationSwitcher.bind(this);
  }
  componentDidMount() {
    window.addEventListener("resize", this.handleResize, false);
    document.addEventListener("keydown", this.hideOrganisationSwitcher, false);
    const organisationNameElement = document.getElementById("organisationName");
    organisationNameElement && organisationNameElement.focus();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize, false);
    document.removeEventListener(
      "keydown",
      this.hideOrganisationSwitcher,
      false
    );
  }
  hideOrganisationSwitcher(e: any) {
    if (e.key === "Escape") {
      // @ts-ignore
      this.props.handleClose();
    }
  }
  handleResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }
  handleInput(e: any) {
    this.setState({
      filterValue: e.target.value
    });
  }
  selectOrganisation(organisation:any) {
    // @ts-ignore
    this.props.selectOrganisation(organisation, true);
  }
  render() {
    const {
      // @ts-ignore
      handleClose,
      // @ts-ignore
      organisations,
      // @ts-ignore
      selectedOrganisation,
      // @ts-ignore
      isFetching
    } = this.props;

    // @ts-ignore
    const filteredOrganisations = this.state.filterValue
      ? organisations.filter((org:any) => {
        // @ts-ignore  
        if (org.name.toLowerCase().indexOf(this.state.filterValue) !== -1) {
            return org;
          }
          return false;
        })
      : organisations;

    const currentHomeAppTile = appTiles.find(icon => {
      return window.location.href.includes(icon.linksTo)
    });
    // @ts-ignore
    const authorisationText = this.props.intl.formatMessage({ id: "authorization.organisation_not_allowed_current_page", defaultMessage: "! Organisation not authorized to visit current page !" });

        

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
                onChange={this.handleInput}
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
                style={{ width: "100%", height: this.state.height - 400 }}
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
                            this.selectOrganisation(organisation);
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
}

// @ts-ignore
const mapStateToProps = (state, ownProps) => {
  return {
    selectedOrganisation: state.organisations.selected,
    organisations: state.organisations.available,
    isFetching: state.organisations.isFetching
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
