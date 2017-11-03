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
        <div style={{ backgroundColor: "#239f85" }}>
          <div className="container">
            <nav className="navbar navbar-expand-lg">
              <NavLink to={"/"}>
                <div
                  className={styles.LizardLogo}
                  style={{
                    backgroundImage: `url(${lizardIcon})`
                  }}
                />
              </NavLink>

              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>

              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <form className="form-inline my-2 my-lg-0">
                  <input
                    className="form-control mr-sm-2"
                    type="text"
                    placeholder="Search"
                  />
                </form>
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item active">
                    <a className="nav-link" href="#apps">
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
                      Apps <span className="sr-only">(current)</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="https://sso.lizard.net/edit_profile/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa fa-user" />&nbsp;&nbsp;{firstName}
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link ${styles.OrganisationLink}`}
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
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>

        <div className="secondary-nav">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h2 className="breadcrumb-navigation">
                  <NavLink to="/">Lizard Management</NavLink>
                  {breadcrumbs}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <Route exact path="/" component={Home} />
        <Route path="/alarms" component={AlarmsApp} />

        <footer className="footer">
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-sm-6">
                <div>
                  <a href="https://www.lizard.net/handleidingen/log_in_instructies_lizard_6.01.pdf">
                    <FormattedMessage
                      id="index.documentation"
                      defaultMessage="Documentation"
                    />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-inline float-right language-and-support">
                  <li className="list-inline-item">
                    <LanguageSwitcher
                      locale={preferredLocale}
                      languages={[
                        { code: "nl", language: "Nederlands" },
                        { code: "en", language: "English" }
                      ]}
                    />
                  </li>
                  <li className="list-inline-item">
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
                  </li>
                </ul>
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
