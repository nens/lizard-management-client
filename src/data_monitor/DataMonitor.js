import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import AppIcon from "../components/AppIcon";
import { withRouter } from "react-router-dom";
import { Trail, animated } from "react-spring";
import templateIcon from "../images/templates@3x.svg";

class DataMonitor extends Component {
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
        handleClick: () => this.handleLink("data_monitor/rasters"),
        title: (
          <FormattedMessage
            id="data_monitor.rasters"
            defaultMessage="Rasters"
          />
        ),
        icon: templateIcon,
        subTitle: (
          <FormattedMessage
            id="data_monitor.manage_rasters"
            defaultMessage="Manage rasters"
          />
        )
      },
      {
        key: 1,
        handleClick: () => this.handleLink("data_monitor/assets"),
        title: (
          <FormattedMessage id="data_monitor.assets" defaultMessage="Assets" />
        ),
        icon: templateIcon,
        subTitle: (
          <FormattedMessage
            id="data_monitor.manage_assets"
            defaultMessage="Manage assets"
          />
        )
      },
      {
        key: 2,
        handleClick: () => this.handleLink("data_monitor/other_data"),
        title: (
          <FormattedMessage
            id="data_monitor.other_data"
            defaultMessage="Other"
          />
        ),
        icon: templateIcon,
        subTitle: (
          <FormattedMessage
            id="data_monitor.manage_other_data"
            defaultMessage="Manage other data"
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

DataMonitor = withRouter(DataMonitor);
export { DataMonitor };
