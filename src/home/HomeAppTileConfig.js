import React from "react";
import { FormattedMessage } from "react-intl";

import alarmIcon from "../images/alarm@3x.svg";
import userManagementIcon from "../images/userManagement.svg";
import dataManagementIcon from "../images/database.svg";
import personalApiKeysIcon from "../images/personal_api_key_icon.svg";

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
  },
  {
    requiredRoles: ["user", "admin", "supplier", "manager"],
    key: 3,
    linksTo: {
      external: false,
      path: "/personal_api_keys"
    },
    title: (
      <FormattedMessage
        id="home.personal_api_keys"
        defaultMessage="Personal API keys"
      />
    ),
    icon: personalApiKeysIcon,
  },
];

export {appTiles};