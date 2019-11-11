import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import styles from "./App.css";
import AppIcon from "../components/AppIcon";
import { withRouter } from "react-router-dom";
import { Trail, animated } from "react-spring";

import alarmIcon from "../images/alarms.svg";//"../images/AlarmsIcon_65px.svg;"
import userManagementIcon from "../images/usermanagement.svg";//"../images/groups_65px.svg";
import templateIcon from "../images/datamanagement.svg";//"../images/data_management@3x.svg";

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
        handleClick: () => this.handleExternalLink("/management/users/"),
        bgImage: userManagementIcon
      },
      {
        key: 1,
        handleClick: () => this.handleLink("/alarms"),
        bgImage: alarmIcon
      },
      {
        key: 2,
        handleClick: () => this.handleLink("/data_management"),
        bgImage: templateIcon
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
                      bgImage={appIcon.bgImage}
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
