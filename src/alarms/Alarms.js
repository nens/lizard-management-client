import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import AppTile from "../components/AppTile";
import { withRouter } from "react-router-dom";
import { Trail, animated } from "react-spring";

import alarmsTileImage from "../images/alarmsTileImage.svg";
import groupsTileImage from "../images/groupsTileImage.svg";
import contactsTileImage from "../images/contactsTileImage.svg";
import templatesTileImage from "../images/templatesTileImage.svg";
import backArrowTileImage from "../images/backArrowTileImage.svg";

class Alarms extends Component {
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
        handleClick: () => this.handleLink("alarms/notifications"),
        title: (
          <FormattedMessage
            id="alarms.notifications"
            defaultMessage="Notifications"
          />
        ),
        bgImage: alarmsTileImage
      },
      {
        key: 1,
        handleClick: () => this.handleLink("alarms/groups"),
        title: (
          <FormattedMessage
            id="alarms.recipients"
            defaultMessage="Recipients"
          />
        ),
        bgImage: groupsTileImage
      },
      {
        key: 2,
        handleClick: () => this.handleLink("alarms/contacts"),
        title: (
          <FormattedMessage
            id="alarms.alarms_contacts"
            defaultMessage="Contacts"
          />
        ),
        bgImage: contactsTileImage
      },
      {
        key: 3,
        handleClick: () => this.handleLink("alarms/templates"),
        title: (
          <FormattedMessage
            id="alarms.alarms_templates"
            defaultMessage="Templates"
          />
        ),
        bgImage: templatesTileImage
      },
      {
        key: 4,
        handleClick: () => this.handleLink(""),
        title: (
          <FormattedMessage
            id="go_back"
            defaultMessage="Go Back"
          />
        ),
        bgImage: backArrowTileImage
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
                    bgImage={appTile.bgImage}
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

Alarms = withRouter(Alarms);
export { Alarms };
