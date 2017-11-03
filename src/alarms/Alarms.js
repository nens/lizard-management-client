import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import AppIcon from "../components/AppIcon";
import { withRouter } from "react-router-dom";

import alarmIcon from "../images/alarm@3x.svg";
import groupsIcon from "../images/groups@3x.svg";
import templatesIcon from "../images/templates@3x.svg";

class Alarms extends Component {
  handleLink(destination) {
    this.props.history.push(destination);
  }

  handleExternalLink(destination) {
    window.location.href = destination;
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <AppIcon
              handleClick={e => this.handleLink("alarms/notifications")}
              src={alarmIcon}
              title={
                <FormattedMessage
                  id="alarms.notifications"
                  defaultMessage="Notifications"
                />
              }
              subTitle={
                <FormattedMessage
                  id="alarms.manage_notifications"
                  defaultMessage="Manage notifications"
                />
              }
            />
            <AppIcon
              handleClick={e => this.handleLink("alarms/groups")}
              src={groupsIcon}
              title={
                <FormattedMessage
                  id="alarms.alarms_groups"
                  defaultMessage="Groups"
                />
              }
              subTitle={
                <FormattedMessage
                  id="alarms.recipient_management"
                  defaultMessage="Recipient management"
                />
              }
            />
            <AppIcon
              handleClick={e => this.handleLink("alarms/contacts")}
              src={groupsIcon}
              title={
                <FormattedMessage
                  id="alarms.alarms_contacts"
                  defaultMessage="Contacts"
                />
              }
              subTitle={
                <FormattedMessage
                  id="alarms.contacts_management"
                  defaultMessage="Contacts management"
                />
              }
            />
            <AppIcon
              handleClick={e => this.handleLink("alarms/templates")}
              src={templatesIcon}
              title={
                <FormattedMessage
                  id="alarms.alarms_templates"
                  defaultMessage="Templates"
                />
              }
              subTitle={
                <FormattedMessage
                  id="alarms.alarms_template_management"
                  defaultMessage="Alarm template management"
                />
              }
            />
            {/* <AppIcon
              handleClick={e => this.handleLink("alarms/message")}
              src="/images/groups@3x.svg"
              title={
                <FormattedMessage
                  id="alarms.group_messages"
                  defaultMessage="Group messages"
                />
              }
              subTitle={
                <FormattedMessage
                  id="alarms.send_group_messages_subtitle"
                  defaultMessage="Send one-off messages to groups of recipients"
                />
              }
            /> */}
          </div>
        </div>
      </div>
    );
  }
}

Alarms = withRouter(Alarms);
export { Alarms };
