import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { NavLink } from "react-router-dom";
import styles from "./Home.css";
import AppIcon from "./AppIcon";
import { withRouter } from "react-router-dom";

class Home extends Component {
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
        <div className="secondary-nav">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h2 className="breadcrumb-navigation">
                  <NavLink to="/">Lizard Management</NavLink>
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className={styles.Apps}>
              <AppIcon
                handleClick={e =>
                  this.handleExternalLink(
                    "https://nxt.staging.lizard.net/management/users/"
                  )}
                src="/images/lizard@3x.svg"
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
                    "https://nxt.staging.lizard.net/management/scenarios/"
                  )}
                src="/images/3di@3x.svg"
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
                src="/images/alarm@3x.svg"
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

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
