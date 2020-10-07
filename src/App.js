import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { App as Home } from "./home/App";
import { App as AlarmsApp } from "./alarms/App";
import { App as DataManagementApp } from "./data_management/App";
import MDSpinner from "react-md-spinner";
import {
  addNotification,
  fetchLizardBootstrap,
  fetchOrganisations,
  fetchObservationTypes,
  fetchSupplierIds,
  fetchColorMaps,
  updateViewportDimensions
} from "./actions";
import { Route, NavLink } from "react-router-dom";
import LanguageSwitcher from "./components/LanguageSwitcher";
import OrganisationSwitcher from "./components/OrganisationSwitcher";
import Snackbar from "./components/Snackbar";
import Breadcrumbs from "./components/Breadcrumbs";
import styles from "./App.module.css";
import gridStyles from "./styles/Grid.module.css";
import buttonStyles from "./styles/Buttons.module.css";
import lizardIcon from "./images/lizard.svg";
import { withRouter } from "react-router-dom";
import {appTiles} from './home/HomeAppTileConfig';
import doArraysHaveEqualElement from './utils/doArraysHaveEqualElement';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOrganisationSwitcher: false,
      showProfileList: false
    };
    this.updateOnlineStatus = this.updateOnlineStatus.bind(this);
    this.updateViewportDimensions = this.updateViewportDimensions.bind(this);
  }
  //Click the user-profile button open the dropdown
  //Click anywhere outside of the user-profile modal will close the modal
  onUserProfileClick = (e) => {
    return e.target.id === "user-profile" ? 
      this.setState({ showProfileList: !this.state.showProfileList }) : 
      this.setState({ showProfileList: false });
  }

  componentDidMount() {
    window.addEventListener("online", e => this.updateOnlineStatus(e));
    window.addEventListener("offline", e => this.updateOnlineStatus(e));
    window.addEventListener("resize", e => this.updateViewportDimensions(e));
    this.props.getLizardBootstrap();
  }
  componentWillUnmount() {
    window.removeEventListener("online", e => this.updateOnlineStatus(e));
    window.removeEventListener("offline", e => this.updateOnlineStatus(e));
    window.removeEventListener("resize", e => this.updateViewportDimensions(e));
  }
  componentWillReceiveProps(props) {
    if (props.isAuthenticated) {
      if (props.mustFetchColorMaps) props.getColorMaps();
      if (props.mustFetchOrganisations) props.getOrganisations();
      if (props.mustFetchObservationTypes) props.getObservationTypes();
      if (props.mustFetchSupplierIds) props.getSupplierIds();
    }
  }
  updateOnlineStatus(e) {
    const { addNotification } = this.props;
    addNotification(`Your internet connection seems to be ${e.type}`, 2000);
  }
  updateViewportDimensions() {
    const { updateViewportDimensions } = this.props;
    const { innerWidth, innerHeight } = window;
    updateViewportDimensions(innerWidth, innerHeight);
  }
  renderProfileList() {
    return (
      <div
        className={styles.DropdownMenu}
        onMouseLeave={() => this.setState({showProfileList: false})}
      >
        <a href="https://sso.lizard.net/edit_profile/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa fa-pencil" />
          &nbsp;&nbsp;Edit Profile
        </a>
        <a href="/accounts/logout/" >
          <i className="fa fa-power-off" />
          &nbsp;&nbsp;Logout
        </a>
      </div>
    );
  };

  render() {

    if ( 
      this.props.availableOrganisations.length === 0 && 
      this.props.isFetchingOrganisations === false &&
      this.props.timesFetchedOrganisations > 0
    ) {
      const norolesMessage = this.props.intl.formatMessage({ id: "authorization.no_roles_message", defaultMessage: "Dear user, \nYou seem not to be in any organisations that can access the management pages. \nTherefore you are redirected to the mainpage." });
      alert(norolesMessage);
      // should redirect to <customer_url>.lizard.net on prod
      window.location = "/";
    }

    const currentHomeAppTile = appTiles.find(tile => {
      return window.location.href.includes(tile.linksTo.path)
    });
    if (currentHomeAppTile && !doArraysHaveEqualElement(this.props.selectedOrganisation.roles, currentHomeAppTile.requiredRoles)) {
      const redirectMessage = this.props.intl.formatMessage({ id: "authorization.redirected_based_onrole", defaultMessage: "You do not have the rights to access this data under the selected organisation. \nYou will be redirected." });
      alert(redirectMessage);
      // should redirect to <customer_url>.lizard.net/management/ on prod
      this.props.history.push("/");
    }
    if (!this.props.isAuthenticated) {
      return (
        <div className={styles.MDSpinner}>
          <MDSpinner size={24} />
        </div>
      );
    } else {
      const { preferredLocale, bootstrap, selectedOrganisation } = this.props;
      const firstName = bootstrap.bootstrap.user
        ? bootstrap.bootstrap.user.first_name
        : "...";
      const { showOrganisationSwitcher } = this.state;

      return (
        <div className={styles.App} onClick={this.onUserProfileClick}>
          <div className={`${styles.Primary}`}>
            <div className={gridStyles.Container}>
              <div className={gridStyles.Row}>
                <div
                  style={{ height: "55px" }}
                  className={`${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs12}`}
                >
                  <NavLink to="/">
                    <img src={`${lizardIcon}`} alt="Lizard logo" className={styles.LizardLogo} />
                  </NavLink>
                </div>
                <div
                  className={`${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs12}`}
                >
                  <div className={styles.TopNav}>
                    <div style={{ display: "none" }}>
                      <a href="#apps">
                        <i className={`material-icons ${styles.AppIcon}`}>
                          apps
                        </i>
                        Apps
                      </a>
                    </div>
                    <div
                      className={styles.OrganisationLinkContainer}
                      onClick={() =>
                        this.setState({
                          showOrganisationSwitcher: true
                        })
                      }
                    >
                      <button
                        className={`${buttonStyles.ButtonLink} ${styles.OrganisationLink}`}
                        title={
                          selectedOrganisation
                            ? selectedOrganisation.name
                            : "Select organisation"
                        }
                      >
                        <i className="fa fa-sort" />
                        &nbsp;&nbsp;
                        {selectedOrganisation
                          ? selectedOrganisation.name
                          : "Select organisation"}
                      </button>
                    </div>
                    <div
                      className={styles.Profile}
                      id="user-profile"
                    >
                      <div id="user-profile">
                        <i className="fa fa-user" style={{ paddingRight: 8 }} id="user-profile"/>
                        {firstName}
                      </div>
                      {this.state.showProfileList && this.renderProfileList()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.Secondary}`}>
            <div className={gridStyles.Container}>
              <div className={gridStyles.Row}>
                <Breadcrumbs
                  // The same location is needed to calculate the breadcrumbs.
                  location= {this.props.location}
                />
              </div>
            </div>
          </div>
          <div className={gridStyles.Container + " " + styles.AppContent}>
            <div className={gridStyles.Row}>
              <div
                style={{ 
                  margin: "25px 0 25px 0",
                  width: "100%" 
                }}
                className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
              >
                <Route exact path="/" component={Home} />
                <Route path="/alarms" component={AlarmsApp} />
                <Route path="/data_management" component={DataManagementApp} />
              </div>
            </div>
          </div>
          <footer className={styles.Footer}>
            <div className={gridStyles.Container}>
              <div className={gridStyles.Row}>
                <div
                  className={`${styles.FooterLeft} ${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs6}`}
                >
                  <a
                    href="https://docs.lizard.net/a_lizard.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FormattedMessage
                      id="index.documentation"
                      defaultMessage="Documentation"
                    />
                    &nbsp;
                    <i
                      className={`${styles.DocumentationHyperlink} material-icons`}
                    >
                      local_library
                    </i>
                  </a>
                </div>
                <div
                  className={`${styles.FooterRight} ${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs6}`}
                >
                  <div className={styles.FooterRightWrapper}>
                    <div style={{ margin: "0 10px 0 10px" }}>
                      <LanguageSwitcher
                        locale={preferredLocale}
                        languages={[
                          { code: "nl", language: "Nederlands" },
                          { code: "en", language: "English" }
                        ]}
                      />
                    </div>
                    <div>
                      <a
                        href="https://nelen-schuurmans.topdesk.net/tas/public/ssp"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i
                          className={`${styles.SupportHyperlink} material-icons`}
                        >
                          headset_mic
                        </i>
                        &nbsp;
                        <FormattedMessage
                          id="index.support"
                          defaultMessage="Support"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </footer>
          {showOrganisationSwitcher ? (
            <OrganisationSwitcher
              handleClose={() =>
                this.setState({ showOrganisationSwitcher: false })}
            />
          ) : null}
          <Snackbar />
        </div>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isFetching: state.isFetching,
    bootstrap: state.bootstrap,
    isAuthenticated: state.bootstrap.isAuthenticated,

    mustFetchOrganisations:
      state.organisations.available.length === 0 &&
      !state.organisations.isFetching &&
      state.organisations.timesFetched < 1,

    selectedOrganisation: state.organisations.selected,
    availableOrganisations: state.organisations.available,
    isFetchingOrganisations: state.organisations.isFetching,
    timesFetchedOrganisations: state.organisations.timesFetched,

    mustFetchObservationTypes:
      state.observationTypes.available.length === 0 &&
      !state.observationTypes.isFetching &&
      state.observationTypes.timesFetched < 1,
    mustFetchSupplierIds:
      state.organisations.selected &&
      state.supplierIds.available.length === 0 &&
      !state.supplierIds.isFetching &&
      // !state.supplierIds.hasError &&
      state.supplierIds.timesFetched < 1,
    mustFetchColorMaps:
      state.colorMaps.available.length === 0 &&
      !state.colorMaps.isFetching &&
      state.colorMaps.timesFetched < 1
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getLizardBootstrap: () => dispatch(fetchLizardBootstrap()),
    getOrganisations: () => dispatch(fetchOrganisations()),
    getObservationTypes: () => dispatch(fetchObservationTypes()),
    getSupplierIds: () => dispatch(fetchSupplierIds()),
    getColorMaps: () => dispatch(fetchColorMaps()),
    addNotification: (message, timeout) => {
      dispatch(addNotification(message, timeout));
    },
    updateViewportDimensions: (width, height) =>
      dispatch(updateViewportDimensions(width, height))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(App)));
