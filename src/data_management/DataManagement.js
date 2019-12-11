import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import AppTile from "../components/AppTile";
import { withRouter } from "react-router-dom";
import { Trail, animated } from "react-spring";

import rasterIcon from "../images/rasters@3x.svg";
import wmsIcon from "../images/wms@3x.svg";
import threediIcon from "../images/3di@3x.svg";
import backArrowIcon from "../images/backArrow.svg";

class DataManagement extends Component {
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
        handleClick: () => this.handleLink("data_management/rasters"),
        title: (
          <FormattedMessage
            id="data_management.rasters"
            defaultMessage="Rasters"
          />
        ),
        icon: rasterIcon
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
        icon: wmsIcon
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
        icon: threediIcon
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
        icon: backArrowIcon
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
                    icon={appTile.icon}
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
