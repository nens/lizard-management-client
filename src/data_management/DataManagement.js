import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import AppIcon from "../components/AppIcon";
import { withRouter } from "react-router-dom";
import { Trail, animated } from "react-spring";

import rasterIcon from "../images/rasters.svg";
import wmsIcon from "../images/wmslayers.svg";
import threediIcon from "../images/3di-scenarios.svg";
import backArrowIcon from "../images/back-arrow.svg";

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
        bgImage: rasterIcon
      },
      {
        key: 1,
        handleClick: () => this.handleLink("data_management/wms_layers"),
        title: (
          <FormattedMessage
            id="data_management.wms_layers"
            defaultMessage="WMS layers"
          />
        ),
        bgImage: wmsIcon
      },
      {
        key: 2,
        handleClick: () => this.handleLink("data_management/scenarios/"),
        title: (
          <FormattedMessage
            id="home.scenarios"
            defaultMessage="3Di Scenarios"
          />
        ),
        bgImage: threediIcon
      },
      {
        key: 3,
        handleClick: () => this.handleLink(""),
        title: (
          <FormattedMessage
            id="go_back"
            defaultMessage="Go Back"
          />
        ),
        bgImage: backArrowIcon
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
                    title={appIcon.title}
                    bgImage={appIcon.bgImage}
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
