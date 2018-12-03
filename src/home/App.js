import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import styles from "./App.css";
import AppIcon from "../components/AppIcon";
import { withRouter } from "react-router-dom";
import { Trail, animated } from "react-spring";

import alarmIcon from "../images/alarm@3x.svg";
import threediIcon from "../images/3di@3x.svg";
import userManagementIcon from "../images/usermanagement.svg";
import templateIcon from "../images/templates@3x.svg";

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
    const appIcons = [
      {
        key: 0,
        handleClick: () => this.handleExternalLink("/"), //management/users/"),
        title: (
          <FormattedMessage
            id="home.usermanagement"
            defaultMessage="User management"
          />
        ),
        icon: userManagementIcon,
        subTitle: (
          <FormattedMessage
            id="home.sso_management"
            defaultMessage="Single sign-on account management"
          />
        )
      },
      {
        key: 1,
        handleClick: () => this.handleExternalLink("/"), //management/scenarios/"),
        title: (
          <FormattedMessage
            id="home.scenarios"
            defaultMessage="3Di Scenarios"
          />
        ),
        icon: threediIcon,
        subTitle: (
          <FormattedMessage
            id="home.scenario_management"
            defaultMessage="Scenario management"
          />
        )
      },
      {
        key: 2,
        handleClick: () => this.handleLink("/alarms"),
        title: <FormattedMessage id="home.alarms" defaultMessage="Alarms" />,
        icon: alarmIcon,
        subTitle: (
          <FormattedMessage
            id="home.alarm_management"
            defaultMessage="Alarm management"
          />
        )
      },
      {
        key: 3,
        handleClick: () => this.handleLink("/data_management"),
        title: (
          <FormattedMessage
            id="home.data_management"
            defaultMessage="Data Management"
          />
        ),
        icon: templateIcon,
        subTitle: (
          <FormattedMessage
            id="home.data_administration"
            defaultMessage="Data administration"
          />
        )
      }
    ];
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className={styles.Apps}>
              <Trail
                native
                from={{ opacity: 0, x: -5 }}
                to={{ opacity: 1, x: 0 }}
                keys={appIcons.map(item => item.key)}
              >
                {appIcons.map((appIcon, i) => ({ x, opacity }) => (
                  <animated.div
                    style={{
                      opacity,
                      transform: x.interpolate(x => `translate3d(${x}%,0,0)`)
                    }}
                  >
                    <AppIcon
                      handleClick={appIcon.handleClick}
                      key={+new Date()}
                      src={appIcon.icon}
                      title={appIcon.title}
                      subTitle={appIcon.subTitle}
                    />
                  </animated.div>
                ))}
              </Trail>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

App = withRouter(App);

export { App };
