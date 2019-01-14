import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
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
import styles from "./App.css";
import gridStyles from "./styles/Grid.css";
import lizardIcon from "./images/lizard@3x.svg";
import { withRouter } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOrganisationSwitcher: false
    };
    this.uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    this.updateOnlineStatus = this.updateOnlineStatus.bind(this);
    this.updateViewportDimensions = this.updateViewportDimensions.bind(this);
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
  computeBreadcrumb() {
    const { pathname } = this.props.location;
    const splitPathnames = pathname.slice().split("/");
    return pathname === "/"
      ? null
      : splitPathnames.map((sp, i) => {
          const to = `/${splitPathnames.slice(1, i + 1).join("/")}`;
          let title = sp.replace("_", " ");
          let capitalization;
          // Show the uuid as lowercase
          if (this.uuidRegex.test(sp)) {
            capitalization = "lowercase";
          } else {
            capitalization = "capitalize";
          }
          return (
            <NavLink to={to} key={i}>
              <span style={{ textTransform: capitalization }}>
                &nbsp;
                {title}
                {i === splitPathnames.length - 1 ? null : " /"}
              </span>
            </NavLink>
          );
        });
  }
  render() {
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
      const breadcrumbs = this.computeBreadcrumb();

      return (
        <div className={styles.App}>
          <div className={`${styles.Primary}`}>
            <div className={gridStyles.Container}>
              <div className={gridStyles.Row}>
                <div
                  style={{ height: 55 }}
                  className={`${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs12}`}
                >
                  <NavLink to="/">
                    <div
                      className={styles.LizardLogo}
                      style={{ backgroundImage: `url(${lizardIcon})` }}
                    />
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
                    <div className={styles.Profile}>
                      <a
                        href="https://sso.lizard.net/edit_profile/"
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${firstName}`}
                      >
                        <i className="fa fa-user" style={{ paddingRight: 8 }} />
                        {firstName}
                      </a>
                    </div>
                    <div className={styles.OrganisationLinkContainer}>
                      <a
                        className={styles.OrganisationLink}
                        title={
                          selectedOrganisation
                            ? selectedOrganisation.name
                            : "Select organisation"
                        }
                        onClick={() =>
                          this.setState({
                            showOrganisationSwitcher: true
                          })}
                      >
                        <i className="fa fa-sort" />
                        &nbsp;&nbsp;
                        {selectedOrganisation
                          ? selectedOrganisation.name
                          : "Select organisation"}
                      </a>
                    </div>
                    <div>
                      {/* Redirect for logging out.*/}
                      <a href="/accounts/logout/">
                        <i className="fa fa-power-off" />
                        &nbsp;&nbsp;Logout
                      </a>
                    </div>
                  </div>
                  {/* Why is below html ? compare to master */}
                  {/* <div>
                    <a href="https://demo.lizard.net/accounts/logout/">
                      <i className="fa fa-power-off" />&nbsp;&nbsp;Logout
                    </a>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.Secondary}`}>
            <div className={gridStyles.Container}>
              <div className={gridStyles.Row}>
                <div
                  className={`${styles.BreadcrumbsContainer} ${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
                >
                  <div
                    style={{
                      display: "flex",
                      flex: "0 0 auto"
                    }}
                  >
                    <NavLink to="/">Lizard Management</NavLink>
                    {breadcrumbs}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={gridStyles.Container + " " + styles.AppContent}>
            <div className={gridStyles.Row}>
              <div
                style={{ margin: "25px 0 25px 0" }}
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
                    href="https://www.lizard.net/handleidingen/log_in_instructies_lizard_6.01.pdf"
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
