import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import AppIcon from "../components/AppIcon";
import { withRouter } from "react-router-dom";
import { Trail, animated } from "react-spring";
import alarmIcon from "../images/alarms.svg";//"../images/AlarmsIcon_65px.svg";
import groupsIcon from "../images/groups.svg";//"../images/groups_65px.svg";
import contactsIcon from "../images/contacts.svg";//"../images/Contactsicon2_65px.svg";
import templatesIcon from "../images/templates.svg";//"../images/TemplatesIcon2_65px.svg";
import backArrowIcon from "../images/back-arrow.svg";

class Alarms extends Component {
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
        handleClick: () => this.handleLink("alarms/notifications"),
        title: (
          <FormattedMessage
            id="alarms.notifications"
            defaultMessage="Notifications"
          />
        ),
        bgImage: alarmIcon
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
        bgImage: groupsIcon
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
        bgImage: contactsIcon
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
        bgImage: templatesIcon
      },
      {
        key: 4,
        handleClick: () => this.handleLink(""),
        title: (
          <FormattedMessage
            id="go_back" // add translation@!
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

Alarms = withRouter(Alarms);
export { Alarms };
