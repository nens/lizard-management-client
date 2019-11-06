import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import AppIcon from "../components/AppIcon";
import { withRouter } from "react-router-dom";
import { Trail, animated } from "react-spring";
import alarmIcon from "../images/alarm@3x.svg";
import groupsIcon from "../images/groups@3x.svg";
import templatesIcon from "../images/TemplatesIcon2-81px.svg";

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
        icon: alarmIcon,
        subTitle: (
          <FormattedMessage
            id="alarms.manage_notifications"
            defaultMessage="Manage notifications"
          />
        )
      },
      {
        key: 1,
        handleClick: () => this.handleLink("alarms/groups"),
        title: (
          <FormattedMessage id="alarms.alarms_groups" defaultMessage="Groups" />
        ),
        icon: groupsIcon,
        subTitle: (
          <FormattedMessage
            id="alarms.recipient_management"
            defaultMessage="Recipient management"
          />
        )
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
        icon: groupsIcon,
        subTitle: (
          <FormattedMessage
            id="alarms.contacts_management"
            defaultMessage="Contacts management"
          />
        )
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
        icon: templatesIcon,
        subTitle: (
          <FormattedMessage
            id="alarms.alarms_template_management"
            defaultMessage="Alarm template management"
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

Alarms = withRouter(Alarms);
export { Alarms };
