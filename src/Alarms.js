import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { NavLink } from "react-router-dom";
import AppIcon from "./AppIcon";
import { withRouter } from "react-router-dom";

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
        <div className="secondary-nav">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h2 className="breadcrumb-navigation">
                  <NavLink to="/">Lizard Management</NavLink> /{" "}
                  <NavLink to="/alarms">
                    {
                      <FormattedMessage
                        id="alarms.alarms_breadcrumb"
                        defaultMessage="Alarms"
                      />
                    }
                  </NavLink>
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <AppIcon
              handleClick={e => this.handleLink("alarms/notifications")}
              src="/images/alarm@3x.svg"
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
              src="/images/groups@3x.svg"
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
              handleClick={e => this.handleLink("alarms/templates")}
              src="/images/templates@3x.svg"
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
            <AppIcon
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
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Alarms);
