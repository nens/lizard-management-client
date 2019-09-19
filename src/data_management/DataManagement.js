import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import AppIcon from "../components/AppIcon";
import { withRouter } from "react-router-dom";
import { Trail, animated } from "react-spring";
import rasterIcon from "../images/rasters@3x.svg";
import threediIcon from "../images/3di@3x.svg";

class DataManagement extends Component {
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
        handleClick: () => this.handleLink("data_management/rasters"),
        title: (
          <FormattedMessage
            id="data_management.rasters"
            defaultMessage="Rasters"
          />
        ),
        icon: rasterIcon,
        subTitle: (
          <FormattedMessage
            id="data_management.manage_rasters"
            defaultMessage="Manage rasters"
          />
        )
      },
      {
        key: 1,
        handleClick: () => this.handleLink("data_management/scenarios/"),
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
      }
    ];

    return (
      <div>
        <div className="container">
          <div className="row">
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
    );
  }
}

DataManagement = withRouter(DataManagement);
export { DataManagement };
