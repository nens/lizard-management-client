import React from "react";
import { FormattedMessage } from "react-intl";
import alarmIcon from "../images/alarm@3x.svg";
import userManagementIcon from "../images/userManagement.svg";
import dataManagementIcon from "../images/database.svg";

const appTiles = [
  {
    requiredRoles: ["manager"],
    key: 0,
    linksTo: {
      external: true,
      path: "/management/users/"
    },
    title: (
      <FormattedMessage
        id="home.users"
        defaultMessage="Users"
      />
    ),
    icon: userManagementIcon
  },
  {
    requiredRoles: ["admin", "supplier"],
    key: 1,
    linksTo: {
      external: false,
      path: "/data_management"
    },
    title: (
      <FormattedMessage
        id="home.data_management"
        defaultMessage="Data Management"
      />
    ),
    icon: dataManagementIcon
  },
  {
    requiredRoles: ["admin"],
    key: 2,
    linksTo: {
      external: false,
      path: "/alarms"
    },
    title: (
      <FormattedMessage id="home.alarms" defaultMessage="Alarms" />
    ),
    icon: alarmIcon
  }
];

export {appTiles};