import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import Home from "./Home";
import Alarms from "./Alarms";
import Notifications from "./Notifications";
import NewNotification from "./alarms/notifications/NewNotification";
import { fetchLizardBootstrap } from "./actions";
import { Route, NavLink } from "react-router-dom";
import LanguageSwitcher from "./components/LanguageSwitcher";
import styles from "./App.css";
import { withRouter } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.getLizardBootstrap();
  }
  render() {
    const { preferredLocale, bootstrap } = this.props;
    const firstName = bootstrap.bootstrap.user
      ? bootstrap.bootstrap.user.first_name
      : "";

    return (
      <div className={styles.App}>
        <div style={{ backgroundColor: "#239F85" }}>
          <div className="container">
            <nav className="navbar navbar-expand-lg">
              <NavLink to={"/"}>
                <div className="lizard-logo" />
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
                      Apps <span className="sr-only">(current)</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#account">
                      {firstName}
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#organisation">
                      Parramatta
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>

        <Route exact path="/" component={Home} />
        <Route exact path="/alarms/" component={Alarms} />
        <Route exact path="/alarms/notifications" component={Notifications} />
        <Route
          exact
          path="/alarms/notifications/new"
          component={NewNotification}
        />

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
    getLizardBootstrap: () => dispatch(fetchLizardBootstrap())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
