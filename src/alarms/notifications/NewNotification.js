import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { NotificationForm } from "./NotificationForm";

class NewNotificationModel extends Component {
  render() {
    return <NotificationForm wizardStyle={true} />;
  } 
}

const App = withRouter(NewNotificationModel);

export { App };
