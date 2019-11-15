import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import styles from "./App.css";
import AppTile from "../components/AppTile";
import { withRouter } from "react-router-dom";
import { Trail, animated } from "react-spring";

import alarmTileImage from "../images/alarmsTileImage.svg";
import userManagementTileImage from "../images/userManagementTileImage.svg";
import dataManagementTileImage from "../images/dataManagementTileImage.svg";

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
    const appTiles = [
      {
        key: 0,
        handleClick: () => this.handleExternalLink("/management/users/"),
        title: (
          <FormattedMessage
            id="home.users"
            defaultMessage="Users"
          />
        ),
        bgImage: userManagementTileImage
      },
      {
        key: 1,
        handleClick: () => this.handleLink("/data_management"),
        title: (
          <FormattedMessage
            id="home.data_management"
            defaultMessage="Data Management"
          />
        ),
        bgImage: dataManagementTileImage
      },
      {
        key: 2,
        handleClick: () => this.handleLink("/alarms"),
        title: <FormattedMessage id="home.alarms" defaultMessage="Alarms" />,
        bgImage: alarmTileImage
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
                keys={appTiles.map(item => item.key)}
              >
                {appTiles.map((appTile, i) => ({ x, opacity }) => (
                  <animated.div
                    style={{
                      opacity,
                      transform: x.interpolate(x => `translate3d(${x}%,0,0)`)
                    }}
                  >
                    <AppTile
                      handleClick={appTile.handleClick}
                      key={+new Date()}
                      title={appTile.title}
                      bgImage={appTile.bgImage}
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
