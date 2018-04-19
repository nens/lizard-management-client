import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import styles from "./App.css";
import AppIcon from "../components/AppIcon";
import { withRouter } from "react-router-dom";

import alarmIcon from "../images/alarm@3x.svg";
import threediIcon from "../images/3di@3x.svg";
import lizardIcon from "../images/lizard@3x.svg";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleLink = this.handleLink.bind(this);
    this.handleExternalLink = this.handleExternalLink.bind(this);
  }

  handleLink(destination) {
    this.props.history.push(destination);
  }

  handleExternalLink(destination) {
    window.location.href = destination;
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className={styles.Apps}>
              <AppIcon
                handleClick={e =>
                  this.handleExternalLink(
                    "/management/users/"
                  )}
                src={lizardIcon}
                title={
                  <FormattedMessage
                    id="home.usermanagement"
                    defaultMessage="User management"
                  />
                }
                subTitle={
                  <FormattedMessage
                    id="home.sso_management"
                    defaultMessage="Single sign-on account management"
                  />
                }
              />
              <AppIcon
                handleClick={e =>
                  this.handleExternalLink(
                    "/management/scenarios/"
                  )}
                src={threediIcon}
                title={
                  <FormattedMessage
                    id="home.scenarios"
                    defaultMessage="3Di Scenarios"
                  />
                }
                subTitle={
                  <FormattedMessage
                    id="home.scenario_management"
                    defaultMessage="Scenario management"
                  />
                }
              />
              <AppIcon
                handleClick={e => this.handleLink("/alarms")}
                src={alarmIcon}
                title={
                  <FormattedMessage id="home.alarms" defaultMessage="Alarms" />
                }
                subTitle={
                  <FormattedMessage
                    id="home.alarm_management"
                    defaultMessage="Alarm management"
                  />
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

App = withRouter(App);

export {App};
