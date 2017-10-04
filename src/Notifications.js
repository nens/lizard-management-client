import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { NavLink } from "react-router-dom";
import App from "./alarms/notifications/App";

class Notifications extends Component {
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
                        id="notifications.alarms_breadcrumb"
                        defaultMessage="Alarms"
                      />
                    }
                  </NavLink>{" "}
                  /{" "}
                  <NavLink to="/alarms/notifications">
                    {
                      <FormattedMessage
                        id="notifications.alarms_notifications"
                        defaultMessage="Notifications"
                      />
                    }
                  </NavLink>
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <App />
        </div>
      </div>
    );
  }
}

export default Notifications;
