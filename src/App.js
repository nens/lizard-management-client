import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { App as Home } from "./home/App";
import { App as AlarmsApp } from "./alarms/App";
import { fetchLizardBootstrap, fetchOrganisations } from "./actions";
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
  }
  componentDidMount() {
    this.props.getLizardBootstrap();
    this.props.getOrganisations();
  }
  computeBreadcrumb() {
    const { pathname } = this.props.location;
    const splitPathnames = pathname.slice().split("/");
    return pathname === "/"
      ? null
      : splitPathnames.map((sp, i) => {
          const to = `/${splitPathnames.slice(1, i + 1).join("/")}`;
          let title = sp;
          if (this.uuidRegex.test(sp)) {
            title = "Detail";
          }
          return (
            <NavLink to={to} key={i}>
              <span style={{ textTransform: "capitalize" }}>
                &nbsp;{title}
                {i === splitPathnames.length - 1 ? null : " /"}
              </span>
            </NavLink>
          );
        });
  }
  render() {
    const { preferredLocale, bootstrap } = this.props;
    const firstName = bootstrap.bootstrap.user
      ? bootstrap.bootstrap.user.first_name
      : "";
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
                    style={{
                      backgroundImage: `url(${lizardIcon})`
                    }}
                  />
                </NavLink>
              </div>
              <div
                className={`${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs12}`}
              >
                <div className={styles.TopNav}>
                  <div>
                    <a href="#apps">
                      <i
                        className="material-icons"
                        style={{
                          fontSize: 17,
                          position: "relative",
                          left: -7,
                          top: 3
                        }}
                      >
                        apps
                      </i>
                      Apps
                    </a>
                  </div>
                  <div>
                    <a
                      href="https://sso.lizard.net/edit_profile/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa fa-user" />&nbsp;&nbsp;{firstName}
                    </a>
                  </div>
                  <div>
                    <a
                      className={styles.OrganisationLink}
                      title={
                        bootstrap.organisation
                          ? bootstrap.organisation.name
                          : "Select organisation"
                      }
                      onClick={() =>
                        this.setState({
                          showOrganisationSwitcher: true
                        })}
                    >
                      <i className="fa fa-sort" />&nbsp;&nbsp;
                      {bootstrap.organisation
                        ? bootstrap.organisation.name
                        : "Select organisation"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.Secondary}`}>
          <div className={gridStyles.Container}>
            <div className={gridStyles.Row}>
              <div
                style={{
                  height: 65,
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1.2em"
                }}
                className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
              >
                <NavLink to="/">Lizard Management</NavLink>
                {breadcrumbs}
              </div>
            </div>
          </div>
        </div>

        <div className={gridStyles.Container}>
          <div className={gridStyles.Row}>
            <div
              style={{
                margin: "25px 0 25px 0"
              }}
              className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
            >
              <Route exact path="/" component={Home} />
              <Route path="/alarms" component={AlarmsApp} />
            </div>
          </div>
        </div>
        <footer className={styles.Footer}>
          <div className={gridStyles.Container}>
            <div className={gridStyles.Row}>
              <div
                className={`${styles.FooterLeft} ${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs6}`}
              >
                <a href="https://www.lizard.net/handleidingen/log_in_instructies_lizard_6.01.pdf">
                  <FormattedMessage
                    id="index.documentation"
                    defaultMessage="Documentation"
                  />
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
                    <a href="https://www.lizard.net/support/">
                      <i
                        style={{
                          position: "relative",
                          top: 5,
                          fontSize: "20px"
                        }}
                        className="material-icons"
                      >
                        headset_mic
                      </i>&nbsp;
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

const mapStateToProps = (state, ownProps) => {
  return {
    isFetching: state.isFetching,
    bootstrap: state.bootstrap
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getLizardBootstrap: () => dispatch(fetchLizardBootstrap()),
    getOrganisations: () => dispatch(fetchOrganisations())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
